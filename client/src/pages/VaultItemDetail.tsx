import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Copy,
  Edit,
  Trash2,
  Star,
  Shield,
  CreditCard,
  FileText,
  User,
  ExternalLink,
  Check,
} from "lucide-react";
import { vaultService, VaultItem } from "../services/vault";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const VaultItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<VaultItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string>("");

  useEffect(() => {
    if (id) {
      loadVaultItem(id);
    }
  }, [id]);

  const loadVaultItem = async (itemId: string) => {
    try {
      const vaultItem = await vaultService.getVaultItem(itemId);
      if (vaultItem) setItem(vaultItem);
    } catch (error) {
      console.error("Failed to load vault item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(""), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };
  const handleToggleFavorite = async () => {
    if (!item) return;

    try {
      const updatedItem = await vaultService.toggleFavorite(item?.id);
      setItem(updatedItem);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleDelete = async () => {
    if (!item || !confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await vaultService.deleteVaultItem(item?.id);
      navigate("/vault");
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "LOGIN":
        return <Shield className="h-6 w-6 text-primary" />;
      case "CREDIT_CARD":
        return <CreditCard className="h-6 w-6 text-accent" />;
      case "SECURE_NOTE":
        return <Eye className="h-6 w-6 text-success" />;
      case "IDENTITY":
        return <User className="h-6 w-6 text-warning" />;
      case "DOCUMENT":
        return <FileText className="h-6 w-6 text-destructive" />;
      default:
        return <Shield className="h-6 w-6 text-primary" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/vault")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        </div>

        <Card className="card-security">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/vault")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Item Not Found</h1>
        </div>

        <Card className="card-security">
          <CardContent className="p-12 text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vault Item Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The requested vault item could not be found or you don't have
              access to it.
            </p>
            <Button onClick={() => navigate("/vault")}>Back to Vault</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CopyableField: React.FC<{
    label: string;
    value: string;
    type?: "text" | "password" | "email" | "url";
    fieldKey: string;
  }> = ({ label, value, type = "text", fieldKey }) => {
    const isPassword = type === "password";
    const isUrl = type === "url";
    const displayValue = isPassword && !showPassword ? "••••••••••" : value;

    return (
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {label}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-foreground font-medium truncate">
              {displayValue}
            </p>
            {isUrl && value && (
              <a
                href={value.startsWith("http") ? value : `https://${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPassword && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(value, fieldKey)}
          >
            {copiedField === fieldKey ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/vault")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vault
          </Button>

          <div className="flex items-center gap-3">
            {getTypeIcon(item?.type)}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {item?.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">
                  {item?.type.replace("_", " ").toLowerCase()}
                </Badge>
                {item?.favorite && (
                  <Star className="h-4 w-4 text-warning fill-current" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleToggleFavorite}>
            <Star
              className={`h-4 w-4 mr-2 ${
                item?.favorite ? "fill-current text-warning" : ""
              }`}
            />
            {item?.favorite ? "Unfavorite" : "Favorite"}
          </Button>

          <Link to={`/vault/${item?.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Item Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-security">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {item?.username && (
                <CopyableField
                  label="Username"
                  value={item?.username}
                  fieldKey="username"
                />
              )}

              {item?.email && (
                <CopyableField
                  label="Email"
                  value={item?.email}
                  type="email"
                  fieldKey="email"
                />
              )}

              {/* For demonstration, assuming password field exists */}
              <CopyableField
                label="Password"
                value="demo-password-123"
                type="password"
                fieldKey="password"
              />

              {item?.url && (
                <CopyableField
                  label="Website"
                  value={item?.url}
                  type="url"
                  fieldKey="url"
                />
              )}

              {item?.fields?.map((field, index) => (
                <CopyableField
                  key={index}
                  label={field.label}
                  value={field.value}
                  type={field.type}
                  fieldKey={`field-${index}`}
                />
              ))}
            </CardContent>
          </Card>

          {item?.notes && (
            <Card className="card-security">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-foreground whitespace-pre-wrap">
                    {item?.notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="card-security">
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Category
                </p>
                <p className="text-foreground">
                  {item?.category || "Uncategorized"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Created
                </p>
                <p className="text-foreground">
                  {new Date(item?.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Last Modified
                </p>
                <p className="text-foreground">
                  {new Date(item?.updatedAt).toLocaleString()}
                </p>
              </div>

              {item?.tags && item?.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item?.tags?.split(",")?.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VaultItemDetail;
