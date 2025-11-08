import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().min(50, "Please provide a detailed description (min 50 characters)"),
  thumbnailUrl: z.string().url("Please enter a valid image URL").optional(),
  tags: z.string().optional(),
  category: z.string().optional(),
  githubUrl: z.string().url("Please enter a valid GitHub URL").optional(),
  demoUrl: z.string().url("Please enter a valid demo URL").optional(),
  authorName: z.string().min(2, "Please enter your name"),
  authorEmail: z.string().email("Please enter a valid email address"),
});

// Google Apps Script deployment URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby9_yq0GRGbPcz3YbSZhh8WBpMsw0SUlX0VWDzIU56HKaxnGNqhJmvLFM7Ty0PfFSM/exec";

export default function NewProductForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnailUrl: "",
      tags: "",
      category: "",
      githubUrl: "",
      demoUrl: "",
      authorName: "",
      authorEmail: "",
    },
  });

  async function onSubmit(values: z.infer<typeof productSchema>) {
    try {
      const formData = {
        ...values,
        tags: values.tags ? values.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        submittedAt: new Date().toISOString(),
      };

      // Show loading toast
      const loadingToast = toast.loading("Submitting your project...");

      // Create and submit form
      const submitForm = document.createElement('form');
      submitForm.method = 'POST';
      submitForm.action = GOOGLE_SCRIPT_URL;
      submitForm.target = '_blank';
      submitForm.style.display = 'none';

      // Add the data as a hidden field
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'data';
      hiddenField.value = JSON.stringify(formData);
      submitForm.appendChild(hiddenField);

      // Add form to body and submit
      document.body.appendChild(submitForm);
      submitForm.submit();

      // Wait a moment to ensure the form has been submitted
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Cleanup the form
      if (document.body.contains(submitForm)) {
        document.body.removeChild(submitForm);
      }

      // Show success message
      toast.dismiss(loadingToast);
      toast.success(
        "Project submitted successfully! We'll review it shortly.",
        { duration: 5000 }
      );

      // Reset form and close modal
      form.reset();
      onClose();
    } catch (error: any) {
      console.error("Error submitting project:", error);
      toast.dismiss();
      toast.error(
        error.message || "Failed to submit project. Please try again later.",
        { duration: 5000 }
      );

      // Re-enable the submit button by resetting form state
      form.reset(form.getValues());
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      style={{ 
        maxHeight: '100vh',
        overflowY: 'auto',
        padding: '2rem 0'
      }}
    >
      <div className="glass-card max-w-2xl w-full p-8 relative rounded-2xl shadow-elevated my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close form"
        >
          ✕
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-2">List Your Project on Neubofy</h2>
          <p className="text-muted-foreground">
            Share your AI or automation project with the community. We'll review your submission and add it to the marketplace.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., AI Study Mentor"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Education, Productivity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="What does your project do? What problems does it solve?"
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of your project and its benefits.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., AI, automation, education"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Repository URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://github.com/..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="demoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live Demo URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email *</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://... (PNG, JPG, or WebP)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                className="btn-hero"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit Project"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}