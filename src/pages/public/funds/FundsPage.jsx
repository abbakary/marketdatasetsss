import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, TextField, InputAdornment, Card, CardContent,
  Chip, LinearProgress, Avatar,
} from "@mui/material";
import {
  Search, Wallet, ChevronUp, Calendar, FileIcon, HardDrive, Download,
  MoreVertical, TrendingUp, Users, Target, Clock, CheckCircle, ArrowUpRight,
} from "lucide-react";
import PageLayout from "../components/PageLayout";

const PRIMARY = "#61C5C3";

const fundedDatasets = [
  { id: 1, title: "Global Climate Data 2024", author: "GreenData Inc.", category: "Agriculture and Environment", usability: "10.0", updated: "Updated 2 days ago", files: "3 Files (CSV)", size: "2.5 GB", downloads: "1,245 downloads", votes: 48, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80", price: "299.00", fundingGoal: 50000, fundingRaised: 42300, backers: 142, daysLeft: 12, fundingType: "Grant", description: "Funding to expand climate monitoring to 50 additional regions globally." },
  { id: 2, title: "AI Training Dataset - Images", author: "AIDataHub", category: "Computer Science", usability: "10.0", updated: "Updated 3 days ago", files: "5 Files (Images)", size: "15 GB", downloads: "2,100 downloads", votes: 67, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80", price: "899.00", fundingGoal: 120000, fundingRaised: 98500, backers: 287, daysLeft: 5, fundingType: "Investment", description: "Expanding AI training dataset to 10M labeled images across 500 categories." },
  { id: 3, title: "Healthcare Analytics Dataset", author: "MedData Corp", category: "Social Services", usability: "9.5", updated: "Updated 1 day ago", files: "4 Files (JSON)", size: "5.2 GB", downloads: "0 downloads", votes: 0, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80", price: "899.00", fundingGoal: 80000, fundingRaised: 31200, backers: 89, daysLeft: 21, fundingType: "Research Grant", description: "Anonymizing and expanding patient outcome data for public health research." },
  { id: 4, title: "Energy Consumption Patterns", author: "EnergyStats", category: "Natural Resources and Energy", usability: "9.8", updated: "Updated 8 days ago", files: "5 Files (CSV)", size: "4.2 GB", downloads: "678 downloads", votes: 38, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80", price: "449.00", fundingGoal: 35000, fundingRaised: 35000, backers: 203, daysLeft: 0, fundingType: "Crowdfund", description: "Fully funded! Expanding renewable energy data to 80 countries." },
  { id: 5, title: "Urban Development Stats", author: "CityData Labs", category: "Urban Development and Housing", usability: "9.7", updated: "Updated 7 days ago", files: "3 Files (CSV)", size: "1.2 GB", downloads: "560 downloads", votes: 29, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80", price: "349.00", fundingGoal: 25000, fundingRaised: 8900, backers: 44, daysLeft: 30, fundingType: "Grant", description: "Funding urban data collection for 30 emerging cities in Southeast Asia." },
  { id: 6, title: "Genomics Research Data", author: "BioData Institute", category: "Social Services", usability: "10.0", updated: "Updated 4 days ago", files: "6 Files (CSV, JSON)", size: "8.4 GB", downloads: "340 downloads", votes: 52, image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?auto=format&fit=crop&w=900&q=80", price: "799.00", fundingGoal: 200000, fundingRaised: 156000, backers: 412, daysLeft: 8, fundingType: "Research Grant", description: "Expanding genomics sequencing to rare disease populations worldwide." },
];

const fundingStats = [
  { label: "Total Funded", value: "$2.4M", change: "+18%", icon: <Wallet size={22} color={PRIMARY} /> },
  { label: "Active Campaigns", value: "47", change: "+12", icon: <Target size={22} color={PRIMARY} /> },
  { label: "Total Backers", value: "8,320", change: "+24%", icon: <Users size={22} color={PRIMARY} /> },
  { label: "Success Rate", value: "78%", change: "+5%", icon: <TrendingUp size={22} color={PRIMARY} /> },
];

const fundingTypes = ["All", "Grant", "Investment", "Research Grant", "Crowdfund"];

export default function FundsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("trending");

  const filtered = fundedDatasets.filter(d => {
    const ms = d.title.toLowerCase().includes(search.toLowerCase()) || d.author.toLowerCase().includes(search.toLowerCase());
    const mt = selectedType === "All" || d.fundingType === selectedType;
    return ms && mt;
  }).sort((a, b) => {
    if (sortBy === "trending") return b.backers - a.backers;
    if (sortBy === "ending") return a.daysLeft - b.daysLeft;
    if (sortBy === "funded") return (b.fundingRaised / b.fundingGoal) - (a.fundingRaised / a.fundingGoal);
    return 0;
  });

  return (
    <PageLayout>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fb", py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Wallet size={28} color={PRIMARY} />
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#111827" }}>Dataset Funds</Typography>
            </Box>
            <Typography sx={{ color: "#6b7280", fontSize: "1rem" }}>
              Support dataset creation through grants, investments, and crowdfunding campaigns
            </Typography>
          </Box>

          {/* Stats */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2, mb: 4 }}>
            {fundingStats.map(s => (
              <Card key={s.label} sx={{ borderRadius: 2, border: "1px solid #e5e7eb", boxShadow: "none" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mb: 0.5 }}>{s.label}</Typography>
                      <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827" }}>{s.value}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                        <ArrowUpRight size={13} color="#16a34a" />
                        <Typography sx={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600 }}>{s.change}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: "#e6f7f6" }}>{s.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Search + Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField flex={1} placeholder="Search funding campaigns..." value={search} onChange={e => setSearch(e.target.value)} variant="outlined" size="small"
              sx={{ flex: 1, minWidth: 280, backgroundColor: "#fff", borderRadius: "8px", "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} color="#6b7280" /></InputAdornment> }}
            />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {fundingTypes.map(t => (
                <Chip key={t} label={t} onClick={() => setSelectedType(t)} variant={selectedType === t ? "filled" : "outlined"}
                  sx={{ borderRadius: "6px", fontSize: "0.82rem", backgroundColor: selectedType === t ? PRIMARY : "#fff", color: selectedType === t ? "#fff" : "#374151", borderColor: "#d1d5db", "&:hover": { backgroundColor: selectedType === t ? PRIMARY : "#e6f7f6" } }}
                />
              ))}
            </Box>
          </Box>

          {/* Sort */}
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            {[["trending", "Trending"], ["ending", "Ending Soon"], ["funded", "Most Funded"]].map(([v, l]) => (
              <Box key={v} onClick={() => setSortBy(v)} sx={{ px: 2, py: 0.8, borderRadius: "8px", cursor: "pointer", backgroundColor: sortBy === v ? PRIMARY : "#fff", border: `1px solid ${sortBy === v ? PRIMARY : "#e5e7eb"}` }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: sortBy === v ? "#fff" : "#374151" }}>{l}</Typography>
              </Box>
            ))}
          </Box>

          {/* Funding Cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" }, gap: 3 }}>
            {filtered.map(d => (
              <FundingDatasetCard key={d.id} dataset={d} onOpen={() => navigate(`/dataset-info/${d.id}`, { state: { dataset: d } })} />
            ))}
          </Box>

          {filtered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Wallet size={48} color="#d1d5db" style={{ margin: "0 auto 16px" }} />
              <Typography sx={{ color: "#6b7280" }}>No funding campaigns found</Typography>
            </Box>
          )}
        </Container>
      </Box>
    </PageLayout>
  );
}

function FundingDatasetCard({ dataset, onOpen }) {
  const pct = Math.min(Math.round((dataset.fundingRaised / dataset.fundingGoal) * 100), 100);
  const isFunded = pct >= 100;
  const isEndingSoon = dataset.daysLeft > 0 && dataset.daysLeft <= 7;

  const typeColors = { Grant: "#3b82f6", Investment: "#8b5cf6", "Research Grant": "#f59e0b", Crowdfund: "#22c55e" };
  const typeColor = typeColors[dataset.fundingType] || PRIMARY;

  return (
    <Card sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "none", transition: "all 0.3s ease", cursor: "pointer", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 24px rgba(97,197,195,0.12)", borderColor: PRIMARY } }} onClick={onOpen}>
      {/* Image */}
      <Box sx={{ height: 160, backgroundImage: `url(${dataset.image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
        <Box sx={{ position: "absolute", top: 8, left: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: typeColor }}>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>{dataset.fundingType}</Typography>
        </Box>
        {isFunded && (
          <Box sx={{ position: "absolute", top: 8, right: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: "#16a34a", display: "flex", alignItems: "center", gap: 0.5 }}>
            <CheckCircle size={11} color="#fff" />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>Funded!</Typography>
          </Box>
        )}
        {isEndingSoon && !isFunded && (
          <Box sx={{ position: "absolute", top: 8, right: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: "#dc2626", display: "flex", alignItems: "center", gap: 0.5 }}>
            <Clock size={11} color="#fff" />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>{dataset.daysLeft}d left</Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 0.8 }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dataset.title}</Typography>
          <MoreVertical size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
        </Box>
        <Typography sx={{ fontSize: "0.82rem", color: "#1f2937", fontWeight: 500, mb: 0.8 }}>{dataset.author}</Typography>
        <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mb: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dataset.description}</Typography>

        {/* File Details */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0.6, mb: 1.5, pb: 1.5, borderBottom: "1px solid #e5e7eb" }}>
          {[{ icon: <FileIcon size={12} color={PRIMARY} />, label: dataset.files }, { icon: <HardDrive size={12} color={PRIMARY} />, label: dataset.size }, { icon: <Download size={12} color={PRIMARY} />, label: dataset.downloads }].map((item, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3, p: 0.6, borderRadius: 1, backgroundColor: "#f9fafb" }}>
              {item.icon}
              <Typography sx={{ fontSize: "0.62rem", color: "#6b7280", textAlign: "center", lineHeight: 1.2 }}>{item.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Funding Progress */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>${dataset.fundingRaised.toLocaleString()}</Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>of ${dataset.fundingGoal.toLocaleString()}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4, backgroundColor: "#e5e7eb", "& .MuiLinearProgress-bar": { backgroundColor: isFunded ? "#16a34a" : PRIMARY, borderRadius: 4 } }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.8 }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: isFunded ? "#16a34a" : PRIMARY }}>{pct}% funded</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Users size={12} color="#6b7280" />
              <Typography sx={{ fontSize: "0.78rem", color: "#6b7280" }}>{dataset.backers} backers</Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "6px", overflow: "hidden" }}>
            <Box sx={{ px: 0.8, py: 0.3, borderRight: "1px solid #d1d5db", display: "flex", alignItems: "center" }}><ChevronUp size={12} /></Box>
            <Box sx={{ px: 1, py: 0.3 }}><Typography sx={{ fontSize: "0.75rem", fontWeight: 700 }}>{dataset.votes}</Typography></Box>
          </Box>
          <Box sx={{ px: 2, py: 0.8, backgroundColor: isFunded ? "#f0fdf4" : "#e6f7f6", borderRadius: "8px", border: `1px solid ${isFunded ? "#bbf7d0" : PRIMARY}`, cursor: "pointer" }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: isFunded ? "#16a34a" : PRIMARY }}>{isFunded ? "View Dataset" : "Back This"}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
