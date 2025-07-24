import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { vaultService, CreateVaultItemData } from "../services/vault";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { toast } from "sonner";
import { title } from "process";

const vaultItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["LOGIN", "SECURE_NOTE", "CREDIT_CARD", "IDENTITY", "DOCUMENT"]),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

type VaultItemFormData = z.infer<typeof vaultItemSchema>;

const VaultItemCreate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [customFields, setCustomFields] = useState<
    Array<{
      label: string;
      value: string;
      type: "text" | "password" | "email" | "url";
    }>
  >([]);

  const form = useForm<VaultItemFormData>({
    resolver: zodResolver(vaultItemSchema),
    defaultValues: {
      title: "",
      type: "LOGIN",
      notes: "",
      tags: "",
    },
  });

  const watchedType = form.watch("type");

  const onSubmit = async (data: VaultItemFormData) => {
    setIsLoading(true);
    try {
      const createData: CreateVaultItemData = {
        label: data?.title,
        type: data?.type,
        notes: data?.notes || undefined,
        tags: data?.tags
          ? data?.tags
              .split(",")
              .map((tag) => tag.trim())
              .join(",")
          : undefined,
      };

      const newItem = await vaultService.createVaultItem(createData);
      if (newItem) {
        toast("Vault added successfully");
        form.reset({
          title: "",
          type: "LOGIN",
          notes: "",
          tags: "",
        });
      }
    } catch (error) {
      console.error("Failed to create vault item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { label: "", value: "", type: "text" }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (
    index: number,
    field: "label" | "value" | "type",
    value: string
  ) => {
    const updated = [...customFields];
    updated[index][field] = value as any;
    setCustomFields(updated);
  };

  const getFieldsForType = (type: string) => {
    switch (type) {
      case "LOGIN":
        return ["username", "email", "password", "url"];
      case "CREDIT_CARD":
        return ["username"];
      case "SECURE_NOTE":
        return [];
      case "IDENTITY":
        return ["username", "email"];
      case "DOCUMENT":
        return ["username", "url"];
      default:
        return [];
    }
  };

  const shouldShowField = (fieldName: string) => {
    return getFieldsForType(watchedType).includes(fieldName);
  };

  return (
    <div className="space-y-6 animate-fade-in relative flex flex-col h-full  justify-center">
      {/* Header */}
      <Button
        variant="ghost"
        className="absolute top-5 left-5"
        size="sm"
        onClick={() => navigate("/vault")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Vault
      </Button>
      <div className="flex items-center  gap-4">
        <h1 className="text-2xl font-bold mx-auto text-gradient ">
          Add New Vault Item
        </h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="card-security">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter item title"
                            className="form-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LOGIN">Login</SelectItem>
                            <SelectItem value="CREDIT_CARD">
                              Credit Card
                            </SelectItem>
                            <SelectItem value="SECURE_NOTE">
                              Secure Note
                            </SelectItem>
                            <SelectItem value="IDENTITY">Identity</SelectItem>
                            <SelectItem value="DOCUMENT">Document</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes..."
                          className="form-input min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tags separated by commas"
                          className="form-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/vault")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="btn-security flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Item"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VaultItemCreate;
