import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, X, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function ReportedErrors() {
  const reports = useQuery(api.questions.getReportedQuestions) || [];
  const resolveReport = useMutation(api.questions.resolveReportedQuestion);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleResolve = async (status: "resolved" | "dismissed") => {
    if (!selectedReport) return;

    try {
      await resolveReport({
        reportId: selectedReport._id,
        status,
        adminNote: resolutionNote,
      });
      toast.success(`Report ${status} successfully`);
      setIsDialogOpen(false);
      setSelectedReport(null);
      setResolutionNote("");
    } catch (error) {
      toast.error("Failed to update report");
    }
  };

  const openResolveDialog = (report: any) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reported Errors</h1>
              <p className="text-gray-500 mt-2">
                Manage reported errors in questions from students
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Pending Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No pending reports found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Issue Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report: any) => (
                        <TableRow key={report._id}>
                          <TableCell>
                            {format(report._creationTime, "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            <span title={report.question?.question}>
                              {report.question?.question || "Question deleted"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {report.issueType}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            <span title={report.description}>
                              {report.description}
                            </span>
                          </TableCell>
                          <TableCell>
                            {report.user?.name || "Unknown User"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openResolveDialog(report)}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">Question</h4>
                  <p className="text-gray-900">{selectedReport.question?.question}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 mb-1">Issue Type</h4>
                    <Badge>{selectedReport.issueType}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 mb-1">Reported By</h4>
                    <p>{selectedReport.user?.name}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">Description</h4>
                  <p className="text-gray-900 bg-white p-3 rounded border">
                    {selectedReport.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Note (Optional)</label>
                <Textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Add a note about how this was resolved..."
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleResolve("dismissed")}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Dismiss Report
                </Button>
                <Button
                  onClick={() => handleResolve("resolved")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}