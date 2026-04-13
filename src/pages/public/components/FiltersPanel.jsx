import { Box, Typography, TextField, Chip, InputAdornment, Button } from "@mui/material";
import { X, Search } from "lucide-react";

const PRIMARY_COLOR = "#61C5C3";

export default function FiltersPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
}) {
  const handleTagSearch = (value) => {
    onFiltersChange({
      ...filters,
      tagSearch: value,
    });
  };

  const handleFileTypeToggle = (type) => {
    const currentTypes = filters.fileTypes || [];
    const updated = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFiltersChange({
      ...filters,
      fileTypes: updated,
    });
  };

  const handleLicenseToggle = (license) => {
    const currentLicenses = filters.licenses || [];
    const updated = currentLicenses.includes(license)
      ? currentLicenses.filter(l => l !== license)
      : [...currentLicenses, license];
    onFiltersChange({
      ...filters,
      licenses: updated,
    });
  };

  const handleUsabilityToggle = (rating) => {
    const currentRatings = filters.usabilityRatings || [];
    const updated = currentRatings.includes(rating)
      ? currentRatings.filter(r => r !== rating)
      : [...currentRatings, rating];
    onFiltersChange({
      ...filters,
      usabilityRatings: updated,
    });
  };

  const handleVotedForToggle = (tag) => {
    const currentTags = filters.votedFor || [];
    const updated = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onFiltersChange({
      ...filters,
      votedFor: updated,
    });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <Box
          onClick={onClose}
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9998,
          }}
        />
      )}

      {/* Filter Panel */}
      <Box
        sx={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: { xs: "100%", sm: 420 },
          backgroundColor: "#fff",
          boxShadow: isOpen ? "-4px 0 16px rgba(0, 0, 0, 0.15)" : "none",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 9999,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "3px",
            "&:hover": {
              backgroundColor: "#555",
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 10,
          }}
        >
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: "#111827" }}>
            Filters
          </Typography>
          <Box
            onClick={onClose}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#f3f4f6",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "#e5e7eb",
              },
            }}
          >
            <X size={18} />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2.5 }}>
          {/* Tags Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1.5,
              }}
            >
              Tags
            </Typography>
            <TextField
              fullWidth
              placeholder="Search"
              value={filters.tagSearch || ""}
              onChange={(e) => handleTagSearch(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#6b7280" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                },
              }}
            />
          </Box>

          {/* File Size Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1.5,
              }}
            >
              File Size
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                placeholder="Min"
                value={filters.minSize || ""}
                onChange={(e) =>
                  onFiltersChange({ ...filters, minSize: e.target.value })
                }
                variant="outlined"
                size="small"
                sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
              <Box sx={{ px: 1 }}>
                <Typography sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
                  to
                </Typography>
              </Box>
              <TextField
                placeholder="Max"
                value={filters.maxSize || ""}
                onChange={(e) =>
                  onFiltersChange({ ...filters, maxSize: e.target.value })
                }
                variant="outlined"
                size="small"
                sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
              <Box
                sx={{
                  px: 1.5,
                  py: 0.8,
                  backgroundColor: "#f3f4f6",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  whiteSpace: "nowrap",
                }}
              >
                MB
              </Box>
            </Box>
          </Box>

          {/* File Types Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1.5,
              }}
            >
              File Types
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["CSV", "JSON", "SQLite", "Parquet", "BigQuery"].map((type) => (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => handleFileTypeToggle(type)}
                  variant={
                    (filters.fileTypes || []).includes(type)
                      ? "filled"
                      : "outlined"
                  }
                  sx={{
                    backgroundColor: (filters.fileTypes || []).includes(type)
                      ? PRIMARY_COLOR
                      : "transparent",
                    color: (filters.fileTypes || []).includes(type)
                      ? "#fff"
                      : "#374151",
                    borderColor: "#d1d5db",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    height: 32,
                    "&:hover": {
                      backgroundColor: (filters.fileTypes || []).includes(type)
                        ? PRIMARY_COLOR
                        : "#f3f4f6",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Licenses Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1.5,
              }}
            >
              Licenses
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["Creative Commons", "GPL", "Open Database", "Other"].map(
                (license) => (
                  <Chip
                    key={license}
                    label={license}
                    onClick={() => handleLicenseToggle(license)}
                    variant={
                      (filters.licenses || []).includes(license)
                        ? "filled"
                        : "outlined"
                    }
                    sx={{
                      backgroundColor: (filters.licenses || []).includes(
                        license
                      )
                        ? PRIMARY_COLOR
                        : "transparent",
                      color: (filters.licenses || []).includes(license)
                        ? "#fff"
                        : "#374151",
                      borderColor: "#d1d5db",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      height: 32,
                      "&:hover": {
                        backgroundColor: (filters.licenses || []).includes(
                          license
                        )
                          ? PRIMARY_COLOR
                          : "#f3f4f6",
                      },
                    }}
                  />
                )
              )}
            </Box>
          </Box>

          {/* Usability Rating Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1.5,
              }}
            >
              Usability Rating
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["8.00 or higher", "9.00 or higher", "10.00"].map((rating) => (
                <Chip
                  key={rating}
                  label={rating}
                  onClick={() => handleUsabilityToggle(rating)}
                  variant={
                    (filters.usabilityRatings || []).includes(rating)
                      ? "filled"
                      : "outlined"
                  }
                  sx={{
                    backgroundColor: (filters.usabilityRatings || []).includes(
                      rating
                    )
                      ? PRIMARY_COLOR
                      : "transparent",
                    color: (filters.usabilityRatings || []).includes(rating)
                      ? "#fff"
                      : "#374151",
                    borderColor: "#d1d5db",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    height: 32,
                    "&:hover": {
                      backgroundColor: (filters.usabilityRatings || []).includes(
                        rating
                      )
                        ? PRIMARY_COLOR
                        : "#f3f4f6",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Highly Voted For Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1.5,
              }}
            >
              Highly Voted For
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {[
                "Learning",
                "Research",
                "Application",
                "Well-documented",
                "Well-maintained",
                "Clean data",
                "Original",
                "High-quality notebooks",
                "LLM Fine-Tuning",
              ].map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleVotedForToggle(tag)}
                  variant={
                    (filters.votedFor || []).includes(tag)
                      ? "filled"
                      : "outlined"
                  }
                  sx={{
                    backgroundColor: (filters.votedFor || []).includes(tag)
                      ? PRIMARY_COLOR
                      : "transparent",
                    color: (filters.votedFor || []).includes(tag)
                      ? "#fff"
                      : "#374151",
                    borderColor: "#d1d5db",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    height: 32,
                    "&:hover": {
                      backgroundColor: (filters.votedFor || []).includes(tag)
                        ? PRIMARY_COLOR
                        : "#f3f4f6",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2.5,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: 2,
            position: "sticky",
            bottom: 0,
            backgroundColor: "#fff",
            zIndex: 10,
          }}
        >
          <Button
            fullWidth
            onClick={onClear}
            sx={{
              backgroundColor: "#f3f4f6",
              color: "#374151",
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              py: 1.2,
              borderRadius: "8px",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "#e5e7eb",
              },
            }}
          >
            Clear
          </Button>
          <Button
            fullWidth
            onClick={onApply}
            sx={{
              backgroundColor: PRIMARY_COLOR,
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              py: 1.2,
              borderRadius: "8px",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "#52b0ad",
              },
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </>
  );
}
