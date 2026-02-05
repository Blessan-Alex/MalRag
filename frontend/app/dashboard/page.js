"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    FileText, 
    CheckCircle, 
    XCircle, 
    Bell, 
    Clock, 
    User, 
    Shield,
    AlertTriangle,
    Eye,
    Send,
    Mail,
    MessageSquare,
    Database,
    Settings,
    Activity
} from "lucide-react";

export default function DashboardPage() {
    const [selectedTask, setSelectedTask] = useState(null);
    
    // Mock data - replace with real data from backend
    const documentsProcessed = 1247;
    const pendingReviews = 23;
    const notifications = 5;
    
    const userRole = {
        name: "Safety Supervisor",
        department: "Operations",
        level: "Senior",
        permissions: ["document_review", "system_monitoring", "team_management"]
    };

    const humanReviewTasks = [
        {
            id: 1,
            type: "document",
            title: "Incident Report - Signal Failure",
            status: "pending",
            priority: "high",
            submittedBy: "Station Master - Aluva",
            submittedAt: "2025-01-27 14:30",
            reason: "Poor image quality, text not clearly readable",
            documentUrl: "/documents/incident12.pdf"
        },
        {
            id: 2,
            type: "image",
            title: "Maintenance Checklist Photo",
            status: "pending",
            priority: "medium",
            submittedBy: "Maintenance Team - Vytilla",
            submittedAt: "2025-01-27 13:15",
            reason: "Image blurry, checklist items not visible",
            documentUrl: "/documents/maintenance11.pdf"
        },
        {
            id: 3,
            type: "document",
            title: "Safety Protocol Document",
            status: "pending",
            priority: "high",
            submittedBy: "Safety Officer - Edappally",
            submittedAt: "2025-01-27 12:45",
            reason: "Document rejected by AI - formatting issues",
            documentUrl: "/documents/regulatory15.pdf"
        }
    ];

    const smartNotifications = [
        {
            id: 1,
            type: "deadline",
            title: "Monthly Safety Audit Due",
            message: "Monthly safety audit report is due in 3 days",
            priority: "urgent",
            deadline: "2025-01-30",
            sentTo: ["Safety Team", "Management"],
            sentVia: ["dashboard", "email", "sms"]
        },
        {
            id: 2,
            type: "maintenance",
            title: "Equipment Inspection Required",
            message: "Traction motor inspection scheduled for tomorrow",
            priority: "high",
            deadline: "2025-01-28",
            sentTo: ["Maintenance Team", "Engineering"],
            sentVia: ["dashboard", "email"]
        },
        {
            id: 3,
            type: "compliance",
            title: "Regulatory Update Available",
            message: "New safety regulations have been published",
            priority: "medium",
            deadline: "2025-02-05",
            sentTo: ["All Departments"],
            sentVia: ["dashboard", "email"]
        }
    ];

    const handleTaskAction = (taskId, action) => {
        // Handle accept/reject logic
        console.log(`Task ${taskId} ${action}ed`);
        setSelectedTask(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    <Activity className="h-8 w-8 text-gray-900" />
                                    KOCHI METRO DASHBOARD
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Metro Link AI System - Document Processing & Management
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className="bg-gray-900 text-white border-gray-900">
                                    <Shield className="h-3 w-3 mr-1" />
                                    {userRole.name}
                                </Badge>
                                <Badge variant="outline" className="border-gray-300">
                                    {userRole.department}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Documents Processed</p>
                                        <p className="text-3xl font-bold text-gray-900">{documentsProcessed.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                                        <Database className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                                        <p className="text-3xl font-bold text-gray-900">{pendingReviews}</p>
                                        <p className="text-sm text-gray-500 mt-1">Requires human review</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                                        <Eye className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Notifications</p>
                                        <p className="text-3xl font-bold text-gray-900">{notifications}</p>
                                        <p className="text-sm text-gray-500 mt-1">Urgent matters</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                                        <Bell className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Human Review Tasks */}
                        <Card className="border-gray-200">
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <FileText className="h-5 w-5" />
                                    Human Review Tasks
                                </CardTitle>
                                <p className="text-sm text-gray-600">
                                    Documents and images requiring manual review
                                </p>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-96">
                                    <div className="divide-y divide-gray-200">
                                        {humanReviewTasks.map((task) => (
                                            <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                                                            <Badge className={getPriorityColor(task.priority)}>
                                                                {task.priority}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            Submitted by: {task.submittedBy}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mb-2">
                                                            {task.submittedAt}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Reason: {task.reason}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 ml-4">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setSelectedTask(task)}
                                                            className="border-gray-300 hover:bg-gray-50"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleTaskAction(task.id, 'accept')}
                                                            className="bg-gray-900 hover:bg-gray-800 text-white"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleTaskAction(task.id, 'reject')}
                                                            className="border-gray-300 hover:bg-gray-50"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Smart Notifications */}
                        <Card className="border-gray-200">
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Bell className="h-5 w-5" />
                                    Smart Notifications
                                </CardTitle>
                                <p className="text-sm text-gray-600">
                                    AI-powered alerts and deadline notifications
                                </p>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-96">
                                    <div className="divide-y divide-gray-200">
                                        {smartNotifications.map((notification) => (
                                            <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                        <AlertTriangle className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                                            <Badge className={getPriorityColor(notification.priority)}>
                                                                {notification.priority}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                Due: {notification.deadline}
                                                            </span>
                                                            <span>Sent to: {notification.sentTo.join(", ")}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500">Sent via:</span>
                                                            {notification.sentVia.includes('dashboard') && (
                                                                <Badge variant="outline" className="text-xs px-2 py-0">
                                                                    <Bell className="h-3 w-3 mr-1" />
                                                                    Dashboard
                                                                </Badge>
                                                            )}
                                                            {notification.sentVia.includes('email') && (
                                                                <Badge variant="outline" className="text-xs px-2 py-0">
                                                                    <Mail className="h-3 w-3 mr-1" />
                                                                    Email
                                                                </Badge>
                                                            )}
                                                            {notification.sentVia.includes('sms') && (
                                                                <Badge variant="outline" className="text-xs px-2 py-0">
                                                                    <MessageSquare className="h-3 w-3 mr-1" />
                                                                    SMS
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Role-Based Access Information */}
                    <Card className="mt-8 border-gray-200">
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <User className="h-5 w-5" />
                                User Role & Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Current Role</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <strong>Position:</strong> {userRole.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Department:</strong> {userRole.department}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Level:</strong> {userRole.level}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                                    <div className="space-y-1">
                                        {userRole.permissions.map((permission, index) => (
                                            <Badge key={index} variant="outline" className="mr-1 mb-1">
                                                {permission.replace('_', ' ')}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Access Level</h4>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-gray-600" />
                                        <span className="text-sm text-gray-600">Senior Management Access</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Full access to all system features and administrative functions
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}