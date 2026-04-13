import { Box, Typography, TextField, Chip, InputAdornment, Button, Slider } from "@mui/material";
import { X, Search, Users, Star, TrendingUp, CheckCircle, Clock } from "lucide-react";

/**
 * ProjectFiltersPanel
 * A dedicated filtering panel for Dataset Projects.
 * Tailored for project-specific metadata like status, progress, and community stats.
 */

const PRIMARY_COLOR = "#FF8C00"; // Orange
const SECONDARY_COLOR = "#20B2AA"; // Teal

export default function ProjectFiltersPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
  categories = [],
  statuses = [],
}) {
  const handleToggle = (field, value) => {
    const currentValues = filters[field] || [];
    const updated = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [field]: updated,
    });
  };

  const setSingleValue = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value,
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
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "3px",
            "&:hover": { backgroundColor: "#aaa" },
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
            Project Filters
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
              "&:hover": { backgroundColor: "#e5e7eb" },
            }}
          >
            <X size={18} />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2.5 }}>
          {/* Tags Search */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", mb: 1.5 }}>
              Tags / Keywords
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. climate, machine-learning"
              value={filters.tagSearch || ""}
              onChange={(e) => onFiltersChange({ ...filters, tagSearch: e.target.value })}
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment>,
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
            />
          </Box>

          {/* Project Status */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", mb: 1.5 }}>
              Project Status
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {statuses.filter(s => s !== "All").map((status) => (
                <Chip
                  key={status}
                  label={status}
                  onClick={() => handleToggle("selectedStatuses", status)}
                  variant={filters.selectedStatuses?.includes(status) ? "filled" : "outlined"}
                  sx={{
                    borderRadius: "6px",
                    fontWeight: 600,
                    backgroundColor: filters.selectedStatuses?.includes(status) ? SECONDARY_COLOR : "transparent",
                    color: filters.selectedStatuses?.includes(status) ? "#fff" : "#4b5563",
                    borderColor: "#d1d5db",
                    "&:hover": { backgroundColor: filters.selectedStatuses?.includes(status) ? SECONDARY_COLOR : "#f9fafb" }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Categories */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", mb: 1.5 }}>
              Categories
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {categories.filter(c => c !== "All").map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => handleToggle("selectedCategories", cat)}
                  variant={filters.selectedCategories?.includes(cat) ? "filled" : "outlined"}
                  sx={{
                    borderRadius: "6px",
                    fontWeight: 600,
                    backgroundColor: filters.selectedCategories?.includes(cat) ? PRIMARY_COLOR : "transparent",
                    color: filters.selectedCategories?.includes(cat) ? "#fff" : "#4b5563",
                    borderColor: "#d1d5db",
                    "&:hover": { backgroundColor: filters.selectedCategories?.includes(cat) ? PRIMARY_COLOR : "#f9fafb" }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Progress Slider */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", mb: 2 }}>
              Completion Progress (%)
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={filters.progressRange || [0, 100]}
                onChange={(e, val) => onFiltersChange({ ...filters, progressRange: val })}
                valueLabelDisplay="auto"
                sx={{ color: SECONDARY_COLOR }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>{filters.progressRange?.[0] || 0}%</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>{filters.progressRange?.[1] || 100}%</Typography>
              </Box>
            </Box>
          </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, mb: 4 }}>
              {/* Project Type */}
              <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", mb: 1.5 }}>
                  Project Type
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {["New Dataset Creation", "Data Cleaning & Refinement", "Metadata Enrichment", "Dataset Labelling", "AI Training Set Prep"].map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      onClick={() => handleToggle("selectedProjectTypes", type)}
                      variant={filters.selectedProjectTypes?.includes(type) ? "filled" : "outlined"}
                      sx={{
                        borderRadius: "6px",
                        fontWeight: 600,
                        backgroundColor: filters.selectedProjectTypes?.includes(type) ? SECONDARY_COLOR : "transparent",
                        color: filters.selectedProjectTypes?.includes(type) ? "#fff" : "#4b5563",
                        borderColor: "#d1d5db",
                        "&:hover": { backgroundColor: filters.selectedProjectTypes?.includes(type) ? SECONDARY_COLOR : "#f9fafb" }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Monetization Strategy */}
              <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", mb: 1.5 }}>
                  Monetization Model
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {["Commercial", "Subscription", "One-time Sale", "Open Data"].map((model) => (
                    <Chip
                      key={model}
                      label={model}
                      onClick={() => handleToggle("selectedMonetizationTypes", model)}
                      variant={filters.selectedMonetizationTypes?.includes(model) ? "filled" : "outlined"}
                      sx={{
                        borderRadius: "6px",
                        fontWeight: 600,
                        backgroundColor: filters.selectedMonetizationTypes?.includes(model) ? PRIMARY_COLOR : "transparent",
                        color: filters.selectedMonetizationTypes?.includes(model) ? "#fff" : "#4b5563",
                        borderColor: "#d1d5db",
                        "&:hover": { backgroundColor: filters.selectedMonetizationTypes?.includes(model) ? PRIMARY_COLOR : "#f9fafb" }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <Users size={14} /> Min Contributors
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  value={filters.minContributors || ""}
                  onChange={(e) => onFiltersChange({ ...filters, minContributors: e.target.value })}
                  placeholder="0"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <Star size={14} /> Min Stars
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  value={filters.minStars || ""}
                  onChange={(e) => onFiltersChange({ ...filters, minStars: e.target.value })}
                  placeholder="0"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
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
              fontWeight: 700,
              textTransform: "none",
              py: 1.2,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#e5e7eb" },
            }}
          >
            Clear All
          </Button>
          <Button
            fullWidth
            onClick={onApply}
            sx={{
              backgroundColor: PRIMARY_COLOR,
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              py: 1.2,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#e67e00" },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </>
  );
}
