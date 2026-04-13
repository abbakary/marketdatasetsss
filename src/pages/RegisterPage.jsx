import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// ---- Assets ----
import logo from "../assets/dali-data-logo.png";
import banner1 from "../assets/banner1.png";

// ---- Icons ----
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Globe,
  Briefcase,
  ShoppingCart,
  Store,
  ShieldCheck,
  Search,
  Upload,
  BadgeCheck,
  Wallet,
} from "lucide-react";

// ---- MUI ----
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  MenuItem,
  Stack,
} from "@mui/material";

// ---- Backend ----
const API_BASE = import.meta.env?.VITE_API_BASE || "http://127.0.0.1:8000";
const REGISTER_API = `${API_BASE}/auth/register`;
const ME_API = `${API_BASE}/auth/me`;
const BUSINESS_TYPES_API = `${API_BASE}/business-types`;

const TOKEN_KEY = "dali-token";
const USER_KEY = "dali-user";

// ---- Theme ----
const DALI_BG = "#04121D";
const DALI_PANEL = "#071A29";
const DALI_ACCENT = "#5EC4C3";

// ---- Countries ----
const COUNTRIES = [
  { name: "Tanzania", code: "TZ", dial_code: "+255" },
  { name: "Kenya", code: "KE", dial_code: "+254" },
  { name: "Uganda", code: "UG", dial_code: "+256" },
  { name: "Rwanda", code: "RW", dial_code: "+250" },
  { name: "Burundi", code: "BI", dial_code: "+257" },
  { name: "South Africa", code: "ZA", dial_code: "+27" },
  { name: "Nigeria", code: "NG", dial_code: "+234" },
  { name: "Ghana", code: "GH", dial_code: "+233" },
  { name: "United States", code: "US", dial_code: "+1" },
  { name: "United Kingdom", code: "GB", dial_code: "+44" },
  { name: "Canada", code: "CA", dial_code: "+1" },
  { name: "India", code: "IN", dial_code: "+91" },
];

// ---- Advantage items ----
const portalAdvantages = [
  {
    icon: Search,
    title: "Buyer Access",
    description:
      "Browse, preview, and download trusted datasets from one secure marketplace.",
  },
  {
    icon: ShoppingCart,
    title: "Simple Purchase Flow",
    description:
      "Select datasets, make payments, and instantly access your downloads.",
  },
  {
    icon: Store,
    title: "Seller Opportunities",
    description:
      "Upload datasets and publish valuable data to a global audience.",
  },
  {
    icon: Upload,
    title: "Monetize Your Data",
    description:
      "Earn income from paid datasets and track performance in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Editor Quality Control",
    description:
      "All datasets are reviewed to ensure accuracy, reliability, and compliance.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Marketplace",
    description:
      "Connect buyers, sellers, and editors through a structured approval workflow.",
  },
  {
    icon: Wallet,
    title: "Transparent Payments",
    description:
      "Payments are processed securely and seller earnings are credited automatically.",
  },
];

// ---- Toast helper ----
const toast = (icon, title) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    timer: 3000,
    showConfirmButton: false,
  });
};

// ---- Axios instance ----
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    country: "",
    country_code: "",
    phone: "",
    business_type_id: "",
    role: "buyer",
  });

  const [businessTypes, setBusinessTypes] = useState([]);
  const [businessTypesLoading, setBusinessTypesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const fullName = useMemo(() => {
    return `${form.first_name} ${form.last_name}`.trim();
  }, [form.first_name, form.last_name]);

  useEffect(() => {
    const loadBusinessTypes = async () => {
      try {
        setBusinessTypesLoading(true);

        const res = await api.get("/business-types");

        const raw = res?.data;
        const items = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.results)
              ? raw.results
              : [];

        setBusinessTypes(items);
      } catch (error) {
        console.error("Failed to load business types:", error);
        setBusinessTypes([]);
      } finally {
        setBusinessTypesLoading(false);
      }
    };

    loadBusinessTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      const selectedCountry = COUNTRIES.find((c) => c.name === value);
      setForm((prev) => ({
        ...prev,
        country: value,
        country_code: selectedCountry?.dial_code || "",
      }));
      return;
    }

    if (name === "phone") {
      const numericOnly = value.replace(/[^\d]/g, "");
      setForm((prev) => ({
        ...prev,
        phone: numericOnly,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const normalizePhone = () => {
    if (!form.phone.trim()) return null;

    const localPhone = form.phone.replace(/[^\d]/g, "");
    if (!localPhone) return null;

    if (form.country_code) {
      const cleanedCode = form.country_code.replace("+", "");
      const cleanedLocal = localPhone.startsWith("0")
        ? localPhone.substring(1)
        : localPhone;
      return `+${cleanedCode}${cleanedLocal}`;
    }

    return localPhone;
  };

  const validateForm = () => {
    if (!form.first_name.trim()) {
      toast("error", "First name is required");
      return false;
    }

    if (!form.last_name.trim()) {
      toast("error", "Last name is required");
      return false;
    }

    if (!form.email.trim()) {
      toast("error", "Email is required");
      return false;
    }

    if (!form.password.trim()) {
      toast("error", "Password is required");
      return false;
    }

    if (!form.confirm_password.trim()) {
      toast("error", "Please confirm your password");
      return false;
    }

    if (form.password.length < 6) {
      toast("error", "Password must be at least 6 characters");
      return false;
    }

    if (form.password.length > 72) {
      toast("error", "Password must not exceed 72 characters");
      return false;
    }

    if (form.password !== form.confirm_password) {
      toast("error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        full_name: fullName,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        country: form.country.trim() || null,
        phone: normalizePhone(),
        business_type_id: form.business_type_id
          ? Number(form.business_type_id)
          : null,
        role: form.role || "buyer",
      };

      const registerRes = await api.post("/auth/register", payload);
      const token = registerRes?.data?.access_token;

      if (!token) {
        throw new Error("No access token returned from register API");
      }

      localStorage.setItem(TOKEN_KEY, token);

      const meRes = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem(USER_KEY, JSON.stringify(meRes.data || {}));

      toast("success", "Account created successfully");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";

      toast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const textFieldSx = {
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.92)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: DALI_ACCENT,
    },
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      borderRadius: 2,
      backgroundColor: DALI_BG,
      "& input": {
        color: "#fff",
      },
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.22)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(94,196,195,0.70)",
      },
      "&.Mui-focused fieldset": {
        borderColor: DALI_ACCENT,
      },
    },
    "& .MuiSelect-select": {
      color: "#fff",
    },
    "& .MuiSvgIcon-root": {
      color: "rgba(255,255,255,0.82)",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: DALI_BG,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Box sx={{ display: "flex", minHeight: "100vh", flexWrap: "wrap" }}>
        <Box
          sx={{
            flex: { xs: "1 1 100%", lg: "1 1 58%" },
            minHeight: { xs: "70vh", lg: "100vh" },
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${banner1})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1.03)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(4,18,29,.20), rgba(4,18,29,.92))",
            }}
          />

          <Box
            sx={{
              position: "relative",
              px: { xs: 3, md: 5 },
              py: { xs: 5, md: 6 },
              maxWidth: 940,
              width: "100%",
              color: "#fff",
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: { xs: 24, md: 30 },
                lineHeight: 1.05,
                color: "#fff",
                mb: 2,
              }}
            >
              Join DALI Data Portal
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 14, md: 18 },
                color: "rgba(255,255,255,0.88)",
                lineHeight: 1.8,
                fontWeight: 400,
                maxWidth: 760,
                mb: 4,
              }}
            >
              Register once and become part of a modern data marketplace where
              buyers access trusted datasets, sellers publish and monetize their
              data, and editors maintain quality through structured review and
              approval workflows.
            </Typography>

            <Stack spacing={2.1}>
              {portalAdvantages.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      p: 2,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 48,
                        width: 48,
                        height: 48,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(94,196,195,0.14)",
                        border: "1px solid rgba(94,196,195,0.35)",
                        color: DALI_ACCENT,
                        mt: 0.2,
                      }}
                    >
                      <Icon size={22} />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: 15, md: 18 },
                          fontWeight: 800,
                          color: "#fff",
                          mb: 0.4,
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: { xs: 13, md: 14.5 },
                          color: "rgba(255,255,255,0.82)",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            flex: { xs: "1 1 100%", lg: "1 1 42%" },
            minHeight: { xs: "45vh", lg: "100vh" },
            display: "flex",
            flexDirection: "column",
            bgcolor: DALI_PANEL,
            position: "relative",
            borderLeft: { lg: "1px solid rgba(255,255,255,0.06)" },
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 3,
              py: 4,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 440 }}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Box
                  component="img"
                  src={logo}
                  alt="Dali Data Portal"
                  sx={{ height: 64, objectFit: "contain" }}
                />

                <Typography sx={{ mt: 1, opacity: 0.9, color: "#fff" }}>
                  Create your account
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.7,
                  }}
                >
                  Fill in your details below to register and start using DALI
                  Data Portal.
                </Typography>
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} color={DALI_ACCENT} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />

                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} color={DALI_ACCENT} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} color={DALI_ACCENT} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />

                <TextField
                  fullWidth
                  select
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Globe size={18} color={DALI_ACCENT} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                >
                  <MenuItem value="">Select country</MenuItem>
                  {COUNTRIES.map((country) => (
                    <MenuItem key={country.code} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="Enter phone number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: 700,
                            pr: 1,
                            borderRight: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          <Phone size={18} color={DALI_ACCENT} />
                          <Box component="span">
                            {form.country_code || "+---"}
                          </Box>
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />

                <TextField
                  fullWidth
                  select
                  label="Business Type"
                  name="business_type_id"
                  value={form.business_type_id}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Briefcase size={18} color={DALI_ACCENT} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                >
                  <MenuItem value="">
                    {businessTypesLoading
                      ? "Loading business types..."
                      : "Select business type"}
                  </MenuItem>

                  {businessTypes.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name || item.title || `Business Type ${item.id}`}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  margin="normal"
                  helperText="Password must be 6 to 72 characters"
                  FormHelperTextProps={{
                    sx: { color: "rgba(255,255,255,0.65)" },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color={DALI_ACCENT} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPw((prev) => !prev)}
                          edge="end"
                          sx={{ color: "rgba(255,255,255,0.75)" }}
                        >
                          {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirm_password"
                  type={showConfirmPw ? "text" : "password"}
                  value={form.confirm_password}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color={DALI_ACCENT} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPw((prev) => !prev)}
                          edge="end"
                          sx={{ color: "rgba(255,255,255,0.75)" }}
                        >
                          {showConfirmPw ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 2.5,
                    height: 48,
                    borderRadius: 2,
                    fontWeight: 900,
                    textTransform: "none",
                    bgcolor: DALI_ACCENT,
                    color: "#04121D",
                    boxShadow: "0 12px 24px rgba(94,196,195,0.15)",
                    "&:hover": {
                      bgcolor: "#49b2b1",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "rgba(94,196,195,0.5)",
                      color: "#04121D",
                    },
                  }}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <Typography
                  sx={{
                    textAlign: "center",
                    mt: 2.2,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    underline="none"
                    sx={{ color: DALI_ACCENT, fontWeight: 800 }}
                  >
                    Sign in
                  </Link>
                </Typography>

                <Typography
                  sx={{
                    textAlign: "center",
                    mt: 2,
                    fontSize: 12,
                    opacity: 0.72,
                    color: "#fff",
                  }}
                >
                  © {new Date().getFullYear()} DALI Data Portal
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
