
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { vaultService, CreateVaultItemData } from '../services/vault';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';

const vaultItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['LOGIN', 'SECURE_NOTE', 'CREDIT_CARD', 'IDENTITY', 'DOCUMENT']),
  category: z.string().min(1, 'Category is required'),
  username: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  password: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

type VaultItemFormData = z.infer<typeof vaultItemSchema>;

const VaultItemCreate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [customFields, setCustomFields] = useState<Array<{ label: string; value: string; type: 'text' | 'password' | 'email' | 'url' }>>([]);

  const form = useForm<VaultItemFormData>({
    resolver: zodResolver(vaultItemSchema),
    defaultValues: {
      title: '',
      type: 'LOGIN',
      category: 'Personal',
      username: '',
      email: '',
      password: '',
      url: '',
      notes: '',
      tags: '',
    },
  });

  const watchedType = form.watch('type');

  const onSubmit = async (data: VaultItemFormData) => {
    setIsLoading(true);
    try {
      const createData: CreateVaultItemData = {
        title: data.title,
        type: data.type,
        category: data.category,
        username: data.username || undefined,
        email: data.email || undefined,
        password: data.password || undefined,
        url: data.url || undefined,
        notes: data.notes || undefined,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : undefined,
        fields: customFields.length > 0 ? customFields : undefined,
      };

      const newItem = await vaultService.createVaultItem(createData);
      navigate(`/vault/${newItem.id}`);
    } catch (error) {
      console.error('Failed to create vault item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { label: '', value: '', type: 'text' }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (index: number, field: 'label' | 'value' | 'type', value: string) => {
    const updated = [...customFields];
    updated[index][field] = value as any;
    setCustomFields(updated);
  };

  const getFieldsForType = (type: string) => {
    switch (type) {
      case 'LOGIN':
        return ['username', 'email', 'password', 'url'];
      case 'CREDIT_CARD':
        return ['username'];
      case 'SECURE_NOTE':
        return [];
      case 'IDENTITY':
        return ['username', 'email'];
      case 'DOCUMENT':
        return ['username', 'url'];
      default:
        return [];
    }
  };

  const shouldShowField = (fieldName: string) => {
    return getFieldsForType(watchedType).includes(fieldName);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/vault')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vault
        </Button>
        <h1 className="text-2xl font-bold text-gradient">Add New Vault Item</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="card-security">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LOGIN">Login</SelectItem>
                            <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                            <SelectItem value="SECURE_NOTE">Secure Note</SelectItem>
                            <SelectItem value="IDENTITY">Identity</SelectItem>
                            <SelectItem value="DOCUMENT">Document</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Personal, Work, Finance"
                          className="form-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional Fields Based on Type */}
                {shouldShowField('username') && (
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter username"
                            className="form-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField('email') && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            className="form-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField('password') && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter password"
                              className="form-input pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField('url') && (
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com"
                            className="form-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Custom Fields */}
                {customFields.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Custom Fields</Label>
                    {customFields.map((field, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4 bg-muted/50 rounded-xl">
                        <Input
                          placeholder="Field name"
                          value={field.label}
                          onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                          className="form-input"
                        />
                        <Input
                          placeholder="Field value"
                          type={field.type === 'password' ? 'password' : 'text'}
                          value={field.value}
                          onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                          className="form-input"
                        />
                        <Select value={field.type} onValueChange={(value) => updateCustomField(index, 'type', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="password">Password</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="url">URL</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCustomField(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomField}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Field
                </Button>

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
                    onClick={() => navigate('/vault')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="btn-security flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Item'}
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
