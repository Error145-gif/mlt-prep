import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star, Send, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StudentNav from "@/components/StudentNav";

export default function Feedback() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const myFeedback = useQuery(api.feedback.getMyFeedback);
  const submitFeedback = useMutation(api.feedback.submitFeedback);

  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState("improvement");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({ rating, category, message });
      toast.success("Feedback submitted successfully!");
      setMessage("");
      setRating(5);
      setCategory("improvement");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <StudentNav />
      
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 -z-10 opacity-15"
        style={{
          backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/8bc8f98d-c6cd-4f01-bf46-c5c4f7e11a17)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-16 right-0 z-40 md:hidden bg-white/10 backdrop-blur-xl border-l border-white/20 w-64 h-screen p-4 space-y-3"
          >
            <Button
              onClick={() => {
                navigate("/student");
                setIsMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => {
                navigate("/tests/mock");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Mock Tests
            </Button>
            <Button
              onClick={() => {
                navigate("/tests/pyq");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              PYQ Sets
            </Button>
            <Button
              onClick={() => {
                navigate("/tests/ai");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              AI Questions
            </Button>
            <Button
              onClick={() => {
                navigate("/subscription");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Subscription
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Feedback</h1>
          <p className="text-white/70 mt-1">Help us improve your learning experience</p>
        </div>

        {/* Submit Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-blue-400" />
                <CardTitle className="text-white">Share Your Feedback</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white">Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Your Feedback</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you think..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-32"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Previous Feedback */}
        {myFeedback && myFeedback.length > 0 && (
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white">Your Previous Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {myFeedback.map((feedback) => (
                <div
                  key={feedback._id}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        feedback.status === "resolved" ? "default" :
                        feedback.status === "reviewed" ? "secondary" : "outline"
                      }>
                        {feedback.status}
                      </Badge>
                      <Badge variant="outline">{feedback.category}</Badge>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: feedback.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-white">{feedback.message}</p>
                  {feedback.adminNotes && (
                    <div className="mt-2 p-3 rounded bg-blue-500/10 border border-blue-500/20">
                      <p className="text-sm text-blue-300 font-medium mb-1">Admin Response:</p>
                      <p className="text-sm text-white/80">{feedback.adminNotes}</p>
                    </div>
                  )}
                  <p className="text-xs text-white/50">
                    {new Date(feedback._creationTime).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}