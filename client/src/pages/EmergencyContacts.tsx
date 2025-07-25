import React, { useState, useEffect } from "react";
import {
  Plus,
  Phone,
  Mail,
  User,
  Shield,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import api from "../services/api";
import { useForm } from "react-hook-form";

interface EmergencyContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  relationship: string;
  accessLevel: "VIEW_ONLY" | "LIMITED_ACCESS" | "FULL_ACCESS";
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    relationship: "",
    accessLevel: "VIEW_ONLY" as const,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm();
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await api.get("/api/contact");
      setContacts(response.data);
    } catch (error) {
      console.error("Failed to load emergency contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        phone: data?.phone,
        relationship: data?.relationship,
        accessLevel: data?.relationship,
      };
      const response = await api.post("/api/contact", formData);
      setContacts([...contacts, response.data]);
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        relationship: "",
        accessLevel: "VIEW_ONLY",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add emergency contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to remove this emergency contact?")) {
      return;
    }

    try {
      await api.delete(`/api/contact/${contactId}`);
      setContacts(contacts.filter((c) => c.id !== contactId));
    } catch (error) {
      console.error("Failed to remove contact:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <Badge className="bg-success text-success-foreground">Accepted</Badge>
        );
      case "PENDING":
        return (
          <Badge variant="outline" className="border-warning text-warning">
            Pending
          </Badge>
        );
      case "DECLINED":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "FULL_ACCESS":
        return "text-destructive";
      case "LIMITED_ACCESS":
        return "text-warning";
      case "VIEW_ONLY":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gradient">
            Emergency Contacts
          </h1>
          <Button className="btn-security">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gradient">
            Emergency Contacts
          </h1>
          <p className="text-muted-foreground mt-1">
            Trusted people who can access your vault in emergencies
          </p>
        </div>
        <Button className="btn-security" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-accent/20 bg-accent-light/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-accent p-2 rounded-xl">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-accent mb-2">
                How Emergency Access Works
              </h3>
              <p className="text-sm text-muted-foreground">
                Emergency contacts can request access to your vault if something
                happens to you. You'll receive notifications about access
                requests, and if you don't respond within the waiting period,
                access will be granted automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Contact Form */}
      {showAddForm && (
        <Card className="card-security">
          <CardHeader>
            <CardTitle>Add Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    {...form.register("firstName")}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    {...form.register("lastName")}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  {...form.register("email")}
                  type="email"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  {...form.register("phone")}
                  type="tel"
                  className="form-input"
                />
              </div>

              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  {...form.register("relationship")}
                  className="form-input"
                  placeholder="e.g., Spouse, Parent, Sibling, Friend"
                  required
                />
              </div>

              <div>
                <Label htmlFor="accessLevel">Access Level</Label>
                <select
                  {...form.register("accessLevel")}
                  className="form-input w-full"
                  required
                >
                  <option value="VIEW_ONLY">
                    View Only - Can see items but not sensitive data
                  </option>
                  <option value="LIMITED_ACCESS">
                    Limited Access - Can see most data except passwords
                  </option>
                  <option value="FULL_ACCESS">
                    Full Access - Can see everything
                  </option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="btn-security"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Contact"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <Card className="card-security">
          <CardContent className="p-12 text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Emergency Contacts
            </h3>
            <p className="text-muted-foreground mb-6">
              Add trusted people who can access your vault in case of an
              emergency.
            </p>
            <Button
              className="btn-security"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className="card-security">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary-light p-2 rounded-xl">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  {getStatusBadge(contact.status)}
                </div>

                <h3 className="font-semibold text-foreground mb-1">
                  {contact.firstName} {contact.lastName}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {contact.relationship}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{contact.email}</span>
                  </div>

                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Access Level
                    </p>
                    <p
                      className={`text-sm font-medium ${getAccessLevelColor(
                        contact.accessLevel
                      )}`}
                    >
                      {contact.accessLevel.replace("_", " ").toLowerCase()}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveContact(contact.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;
