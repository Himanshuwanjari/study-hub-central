import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileUp, CheckCircle, Send } from 'lucide-react';
import { Department, ResourceType, Semester, departmentLabels, resourceTypeLabels } from '@/types/resource';
import { useSubmissions } from '@/hooks/useSubmissions';
import { toast } from 'sonner';

export function StudentSubmitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { addSubmission } = useSubmissions();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as ResourceType,
    semester: '' as unknown as Semester,
    department: '' as Department,
    studentName: '',
    studentEmail: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addSubmission({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      department: formData.department,
      semester: Number(formData.semester) as Semester,
      fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
      fileName: fileName || 'document.pdf',
      fileSize: '1.5 MB',
      submittedBy: formData.studentName,
      studentEmail: formData.studentEmail,
    });

    setIsSubmitted(true);
    toast.success('Notes submitted for review!');
    
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
      setFileName(null);
      setFormData({
        title: '',
        description: '',
        type: '' as ResourceType,
        semester: '' as unknown as Semester,
        department: '' as Department,
        studentName: '',
        studentEmail: '',
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Send className="w-4 h-4" />
          Submit Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Submit Your Notes</DialogTitle>
          <DialogDescription>
            Share your study materials. They will be reviewed by faculty before being published.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-12 text-center animate-scale-in">
            <CheckCircle className="w-16 h-16 mx-auto text-primary mb-4" />
            <h3 className="font-display font-semibold text-lg mb-2">Submission Received!</h3>
            <p className="text-muted-foreground text-sm">
              Your notes will be reviewed by faculty. You'll see the status update soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Your Name</Label>
                <Input
                  id="studentName"
                  placeholder="e.g., Rahul Sharma"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  placeholder="you@college.edu"
                  value={formData.studentEmail}
                  onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Data Structures Complete Notes"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the content..."
                className="resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Resource Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as ResourceType })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notes">Notes</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Semester</Label>
                <Select
                  value={formData.semester.toString()}
                  onValueChange={(value) => setFormData({ ...formData, semester: parseInt(value) as Semester })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value as Department })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(departmentLabels) as Department[]).map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {departmentLabels[dept]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>File</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  id="student-file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                />
                <label htmlFor="student-file-upload" className="cursor-pointer">
                  {fileName ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <FileUp className="w-5 h-5" />
                      <span className="font-medium">{fileName}</span>
                    </div>
                  ) : (
                    <>
                      <FileUp className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-medium">Click to upload</span> your notes
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF or DOC up to 10MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-hero hover:opacity-90">
                Submit for Review
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
