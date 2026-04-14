import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, TextField, InputAdornment, Card, CardContent,
  Chip, Avatar, Tab, Tabs, LinearProgress,
} from "@mui/material";
import {
  Search, BarChart3, TrendingUp, TrendingDown, Download, ChevronUp,
  Calendar, FileIcon, HardDrive, MoreVertical, Activity, Eye, Star,
  SlidersHorizontal, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import { categoriesData } from "../components/CategorySidebar";
import { useThemeColors } from "../../../utils/useThemeColors";

const analysisDatasets = [
  { id: 1, title: "Global Climate Trend Analysis 2024", author: "ClimateResearch Lab", category: "Agriculture and Environment", usability: "10.0", updated: "Updated 1 day ago", files: "5 Files (CSV)", size: "3.2 GB", downloads: "2,841 downloads", votes: 72, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80", price: "349.00", trend: "+18%", trendUp: true, views: 9420, rating: 4.9, description: "Comprehensive climate trend analysis with predictive models and historical comparisons." },
  { id: 2, title: "Financial Market Volatility Index", author: "QuantAnalytics", category: "Finance and Investment", usability: "9.8", updated: "Updated 3 days ago", files: "3 Files (CSV)", size: "1.4 GB", downloads: "1,562 downloads", votes: 58, image: "https://images.unsplash.com/photo-1460925895917-adf4e5d1baaa?auto=format&fit=crop&w=900&q=80", price: "599.00", trend: "+24%", trendUp: true, views: 7830, rating: 4.8, description: "Real-time volatility metrics and risk analysis for global financial markets." },
  { id: 3, title: "Healthcare Outcomes Statistical Model", author: "MedAnalytics", category: "Social Services", usability: "9.7", updated: "Updated 2 days ago", files: "4 Files (JSON)", size: "2.8 GB", downloads: "987 downloads", votes: 44, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80", price: "799.00", trend: "+12%", trendUp: true, views: 5210, rating: 4.7, description: "Statistical analysis of patient outcomes across 50+ healthcare facilities." },
  { id: 4, title: "AI Model Performance Benchmarks", author: "AIResearch Hub", category: "Computer Science", usability: "10.0", updated: "Updated 5 hours ago", files: "6 Files (CSV, JSON)", size: "8.1 GB", downloads: "3,214 downloads", votes: 89, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80", price: "899.00", trend: "+31%", trendUp: true, views: 12400, rating: 4.9, description: "Benchmark analysis of 200+ AI models across NLP, vision, and reasoning tasks." },
  { id: 5, title: "Urban Traffic Pattern Analysis", author: "CityMetrics", category: "Infrastructure and Transport", usability: "9.5", updated: "Updated 4 days ago", files: "3 Files (CSV)", size: "1.9 GB", downloads: "743 downloads", votes: 33, image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?auto=format&fit=crop&w=900&q=80", price: "449.00", trend: "-5%", trendUp: false, views: 3890, rating: 4.5, description: "Traffic flow analysis and congestion prediction for 20 major cities." },
  { id: 6, title: "E-Commerce Conversion Analytics", author: "RetailData Pro", category: "Trade and Industry", usability: "9.6", updated: "Updated 6 days ago", files: "2 Files (CSV)", size: "920 MB", downloads: "1,102 downloads", votes: 47, image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=900&q=80", price: "299.00", trend: "+9%", trendUp: true, views: 6120, rating: 4.6, description: "Conversion funnel analysis and customer journey mapping for online retail." },
];

const categoryStats = [
  { name: "Computer Science", datasets: 84, growth: 31, color: "#3b82f6" },
  { name: "Finance", datasets: 62, growth: 18, color: "#10b981" },
  { name: "Healthcare", datasets: 55, growth: 12, color: "#f59e0b" },
  { name: "Agriculture", datasets: 48, growth: 8, color: "#22c55e" },
  { name: "Infrastructure", datasets: 41, growth: 15, color: "#8b5cf6" },
  { name: "Trade", datasets: 37, growth: 9, color: "#ef4444" },
];

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const themeColors = useThemeColors();
  const PRIMARY = themeColors.teal;

  const topMetrics = [
    { label: "Total Datasets Analyzed", value: "1,245", change: "+12%", up: true, icon: <BarChart3 size={22} color={PRIMARY} /> },
    { label: "Avg Usability Score", value: "9.4", change: "+0.3", up: true, icon: <Star size={22} color={PRIMARY} /> },
    { label: "Total Downloads", value: "48.2K", change: "+24%", up: true, icon: <Download size={22} color={PRIMARY} /> },
    { label: "Active Analysts", value: "3,200", change: "+8%", up: true, icon: <Activity size={22} color={PRIMARY} /> },
  ];

  const categories = ["All", ...categoriesData.map(c => c.name)];

  const filtered = analysisDatasets.filter(d => {
    const ms = d.title.toLowerCase().includes(search.toLowerCase()) || d.author.toLowerCase().includes(search.toLowerCase());
    const mc = selectedCategory === "All" || d.category === selectedCategory;
    return ms && mc;
  });

  return (
    <PageLayout>
      <Box sx={{ minHeight: "100vh", backgroundColor: "var(--bg-gray)", py: 4, transition: "background-color 0.3s ease" }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <BarChart3 size={28} color={PRIMARY} />
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-dark)", transition: "color 0.3s ease" }}>
                Dataset Analysis
              </Typography>
            </Box>
            <Typography sx={{ color: "var(--text-muted)", fontSize: "1rem", transition: "color 0.3s ease" }}>
              Explore analytical datasets, performance benchmarks, and data-driven insights
            </Typography>
          </Box>

          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search analysis datasets, models, benchmarks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            variant="outlined"
            sx={{ mb: 4, backgroundColor: "var(--card-bg)", borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px", height: 50 }, transition: "background-color 0.3s ease" }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={20} color="var(--text-muted)" /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><Box sx={{ display: "flex", alignItems: "center", gap: 1, color: PRIMARY, cursor: "pointer" }}><SlidersHorizontal size={18} /><Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: PRIMARY }}>Filters</Typography></Box></InputAdornment>,
            }}
          />

          {/* Metrics Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2, mb: 4 }}>
            {topMetrics.map(m => (
              <Card key={m.label} sx={{ borderRadius: 2, border: "1px solid var(--border-color)", boxShadow: "none", transition: "all 0.3s ease" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography sx={{ fontSize: "0.8rem", color: "var(--text-muted)", mb: 0.5, transition: "color 0.3s ease" }}>{m.label}</Typography>
                      <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-dark)", transition: "color 0.3s ease" }}>{m.value}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                        {m.up ? <ArrowUpRight size={14} color="#16a34a" /> : <ArrowDownRight size={14} color="#dc2626" />}
                        <Typography sx={{ fontSize: "0.8rem", color: m.up ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{m.change}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: "rgba(32, 178, 170, 0.1)" }}>{m.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Category Performance */}
          <Card sx={{ borderRadius: 2, border: "1px solid var(--border-color)", boxShadow: "none", mb: 4, transition: "all 0.3s ease" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-dark)", mb: 2.5, transition: "color 0.3s ease" }}>Category Performance</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)", lg: "repeat(3,1fr)" }, gap: 2 }}>
                {categoryStats.map(cat => (
                  <Box key={cat.name} sx={{ p: 2, borderRadius: 2, border: "1px solid var(--border-color)", backgroundColor: "var(--bg-secondary)", transition: "all 0.3s ease" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-dark)", transition: "color 0.3s ease" }}>{cat.name}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TrendingUp size={14} color="#16a34a" />
                        <Typography sx={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 600 }}>+{cat.growth}%</Typography>
                      </Box>
                    </Box>
                    <LinearProgress variant="determinate" value={(cat.datasets / 84) * 100} sx={{ height: 6, borderRadius: 3, backgroundColor: themeColors.border, "& .MuiLinearProgress-bar": { backgroundColor: cat.color, borderRadius: 3 } }} />
                    <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)", mt: 0.8, transition: "color 0.3s ease" }}>{cat.datasets} datasets</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Category Filter Chips */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {categories.slice(0, 8).map(cat => (
              <Chip key={cat} label={cat} onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? "filled" : "outlined"}
                sx={{ borderRadius: "6px", fontSize: "0.82rem", height: 30, backgroundColor: selectedCategory === cat ? PRIMARY : "var(--card-bg)", color: selectedCategory === cat ? "#fff" : "var(--text-dark)", borderColor: "var(--border-color)", "&:hover": { backgroundColor: selectedCategory === cat ? PRIMARY : "var(--bg-secondary)" }, transition: "all 0.3s ease" }}
              />
            ))}
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: "1px solid var(--border-color)", mb: 3, transition: "border-color 0.3s ease" }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-muted)", transition: "color 0.3s ease" }, "& .MuiTabs-indicator": { backgroundColor: PRIMARY } }}>
              <Tab label="All Analysis" />
              <Tab label="Trending" />
              <Tab label="Top Rated" />
              <Tab label="Most Downloaded" />
            </Tabs>
          </Box>

          {/* Dataset Cards Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" }, gap: 3 }}>
            {filtered.map(d => (
              <AnalysisDatasetCard key={d.id} dataset={d} onOpen={() => navigate(`/dataset-info/${d.id}`, { state: { dataset: d } })} themeColors={themeColors} PRIMARY={PRIMARY} />
            ))}
          </Box>

          {filtered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <BarChart3 size={48} color={themeColors.border} style={{ margin: "0 auto 16px" }} />
              <Typography sx={{ color: "var(--text-muted)" }}>No analysis datasets found</Typography>
            </Box>
          )}
        </Container>
      </Box>
    </PageLayout>
  );
}

function AnalysisDatasetCard({ dataset, onOpen, themeColors, PRIMARY }) {
  return (
    <Card sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-color)", boxShadow: "none", transition: "all 0.3s ease", cursor: "pointer", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 24px rgba(97,197,195,0.12)", borderColor: PRIMARY } }} onClick={onOpen}>
      {/* Image */}
      <Box sx={{ height: 160, backgroundImage: `url(${dataset.image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
        <Box sx={{ position: "absolute", top: 8, left: 8, px: 1, py: 0.4, borderRadius: 1, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", gap: 0.5 }}>
          {dataset.trendUp ? <TrendingUp size={12} color="#4ade80" /> : <TrendingDown size={12} color="#f87171" />}
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: dataset.trendUp ? "#4ade80" : "#f87171" }}>{dataset.trend}</Typography>
        </Box>
        <Box sx={{ position: "absolute", top: 8, right: 8, px: 1, py: 0.4, borderRadius: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
          <Typography sx={{ fontSize: "0.72rem", color: "#fff" }}>{dataset.category}</Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        {/* Title */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 1 }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-dark)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dataset.title}</Typography>
          <MoreVertical size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
        </Box>

        <Typography sx={{ fontSize: "0.85rem", color: "var(--text-dark)", fontWeight: 500, mb: 1 }}>{dataset.author}</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.5, fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <Typography sx={{ fontSize: "inherit" }}>Usability <b style={{ color: "var(--text-dark)" }}>{dataset.usability}</b></Typography>
          <Box sx={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: themeColors.border }} />
          <Calendar size={12} />
          <Typography sx={{ fontSize: "inherit" }}>{dataset.updated}</Typography>
        </Box>

        {/* Stats row */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 1.5, fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><Eye size={12} /><span>{dataset.views.toLocaleString()} views</span></Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><Star size={12} color="#f59e0b" /><span>{dataset.rating}</span></Box>
        </Box>

        {/* File Details */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0.8, mb: 2, pb: 2, borderBottom: "1px solid var(--border-color)" }}>
          {[{ icon: <FileIcon size={13} color={PRIMARY} />, label: dataset.files }, { icon: <HardDrive size={13} color={PRIMARY} />, label: dataset.size }, { icon: <Download size={13} color={PRIMARY} />, label: dataset.downloads }].map((item, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.4, p: 0.8, borderRadius: 1.5, backgroundColor: "var(--bg-secondary)" }}>
              {item.icon}
              <Typography sx={{ fontSize: "0.65rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.3 }}>{item.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", border: "1px solid var(--border-color)", borderRadius: "6px", overflow: "hidden" }}>
            <Box sx={{ px: 1, py: 0.4, borderRight: "1px solid var(--border-color)", display: "flex", alignItems: "center" }}><ChevronUp size={13} /></Box>
            <Box sx={{ px: 1.2, py: 0.3 }}><Typography sx={{ fontSize: "0.78rem", fontWeight: 700 }}>{dataset.votes}</Typography></Box>
          </Box>
          <Box sx={{ px: 1.5, py: 0.6, backgroundColor: "rgba(32, 178, 170, 0.1)", borderRadius: "6px" }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: PRIMARY }}>${dataset.price} USD</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
