import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Star,
  Shield,
  CreditCard,
  Eye,
  FileText,
  User,
  MoreVertical,
  CloudHail,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { vaultService, VaultItem } from "../services/vault";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import api from "@/services/api";
import axios from "axios";

const Vault: React.FC = () => {
  const [vaultItems, setVaultItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState<VaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const parsedData = filteredItems?.data ? filteredItems?.data : [];
  const navigate = useNavigate();

  const itemTypes = [
    { value: "ALL", label: "All Items", icon: Shield },
    { value: "LOGIN", label: "Logins", icon: Shield },
    { value: "CREDIT_CARD", label: "Cards", icon: CreditCard },
    { value: "SECURE_NOTE", label: "Notes", icon: Eye },
    { value: "IDENTITY", label: "Iitemsdentities", icon: User },
    { value: "DOCUMENT", label: "Documents", icon: FileText },
  ];

  useEffect(() => {
    loadVaultItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [vaultItems, searchQuery, selectedType]);

  const loadVaultItems = async () => {
    try {
      const items = await api.get("/api/vault");
      if (items) setVaultItems(items?.data);
    } catch (error) {
      console.error("Failed to load vault items:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const filterItems = () => {
    let filtered = vaultItems;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered?.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.url?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "ALL") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    setFilteredItems(filtered);
  };

  const handleToggleFavorite = async (itemId: string) => {
    try {
      const updatedItem = await vaultService.toggleFavorite(itemId);
      setVaultItems((items) =>
        items.map((item) => (item.id === itemId ? updatedItem : item))
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await vaultService.deleteVaultItem(itemId);
      setVaultItems((items) => items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = itemTypes.find((t) => t.value === type);
    const IconComponent = typeConfig?.icon || Shield;
    return <IconComponent className="h-5 w-5" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "LOGIN":
        return "text-primary bg-primary-light";
      case "CREDIT_CARD":
        return "text-accent bg-accent-light";
      case "SECURE_NOTE":
        return "text-success bg-success-light";
      case "IDENTITY":
        return "text-warning bg-warning-light";
      case "DOCUMENT":
        return "text-destructive bg-destructive-light";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gradient">Vault</h1>
          <Button className="btn-security">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Vault</h1>
          <p className="text-muted-foreground mt-1">
            Manage your secure items and credentials
          </p>
        </div>
        <Button className="btn-security" onClick={() => navigate("/vault/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vault items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {itemTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <IconComponent className="h-4 w-4" />
                {type.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems?.length === 0 ? (
        <Card className="card-security">
          <CardContent className="p-12 text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search terms."
                : "Start securing your digital life by adding your first item."}
            </p>
            <Button
              className="btn-security"
              onClick={() => navigate("/vault/new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems?.map((item) => (
            <Card
              key={item?.id}
              className="card-security hover:shadow-medium transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-xl ${getTypeColor(item?.type)}`}>
                    {getTypeIcon(item?.type)}
                  </div>

                  <div className="flex items-center gap-2">
                    {item?.favorite && (
                      <Star className="h-4 w-4 text-warning fill-current" />
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/vault/${item?.id}`)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/vault/${item?.id}/edit`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleFavorite(item?.id)}
                        >
                          {item?.favorite
                            ? "Remove from Favorites"
                            : "Add to Favorites"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteItem(item?.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <Link to={`/vault/${item?.id}`} className="block">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item?.title}
                  </h3>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    {item?.username && (
                      <p className="truncate">
                        <span className="font-medium">Username:</span>{" "}
                        {item?.username}
                      </p>
                    )}
                    {item?.email && (
                      <p className="truncate">
                        <span className="font-medium">Email:</span>{" "}
                        {item?.email}
                      </p>
                    )}
                    {item?.url && (
                      <p className="truncate">
                        <span className="font-medium">URL:</span> {item?.url}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-xs px-2 py-1 bg-muted rounded-lg">
                      {item?.type.replace("_", " ").toLowerCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item?.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vault;
