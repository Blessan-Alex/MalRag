import {
    Calendar,
    Home,
    Inbox,
    Settings,
    LogOut,
    Plus,
    Trash2,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "./ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { useState } from "react";
import { useChats } from "@/hooks/useChats";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Menu items.
const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];

// Remove dummy data - now using dynamic hooks

export function AppSidebar() {
    const { isMobile } = useSidebar();
    
    // Use dynamic hooks instead of static state
    const {
        chats,
        activeChatId,
        setActiveChatId,
        createNewChat,
        updateChatWithMessage,
        deleteChat
    } = useChats();
    
    const [selectedDocuments, setSelectedDocuments] = useState([]);

    function handleNewChat() {
        createNewChat("New Chat");
    }
    

    // Document checklist data
    const documents = [
        { id: "financial_invoice_traction_motor", name: "Financial Invoice - Traction Motor", category: "Financial" },
        { id: "incident_report_emergency_brake", name: "Incident Report - Emergency Brake", category: "Safety" },
        { id: "incident_report_signal_failure", name: "Incident Report - Signal Failure", category: "Safety" },
        { id: "maintenance_checklist_weekly_inspection", name: "Maintenance Checklist - Weekly", category: "Maintenance" },
        { id: "maintenance_checklist_malayalam", name: "Maintenance Checklist (Malayalam)", category: "Maintenance" },
        { id: "maintenance_schedule_monthly", name: "Maintenance Schedule - Monthly", category: "Maintenance" },
        { id: "incident_report_malayalam", name: "Incident Report (Malayalam)", category: "Safety" },
        { id: "regulatory_directive_safety", name: "Regulatory Directive - Safety", category: "Regulatory" },
        { id: "financial_budget_quarterly", name: "Financial Budget - Quarterly", category: "Financial" },
        { id: "engineering_blueprint_schematic", name: "Engineering Blueprint", category: "Engineering" },
        { id: "dataset_summary", name: "Dataset Summary", category: "Documentation" }
    ];

    const handleDocumentSelect = (docId) => {
        setSelectedDocuments(prev => 
            prev.includes(docId) 
                ? prev.filter(id => id !== docId)
                : [...prev, docId]
        );
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Safety': return 'bg-red-100 text-red-700 border-red-200';
            case 'Maintenance': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Financial': return 'bg-green-100 text-green-700 border-green-200';
            case 'Regulatory': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Engineering': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Documentation': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup className="flex-1 min-h-0">
                    <SidebarGroupLabel>Chat</SidebarGroupLabel>
                    <SidebarGroupContent className="flex-1 min-h-0 flex flex-col">
                        {false ? (
                            <SidebarMenu>
                                {Array.from({ length: 6 }, (_, index) => (
                                    <SidebarMenuItem key={index}>
                                        <Skeleton className="h-[24px] mt-2 w-full rounded-full bg-gray-300 dark:bg-gray-600" />
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        ) : (
                            <>
                                <div className="px-2 pb-2 flex-shrink-0">
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={handleNewChat}
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> New
                                        Chat
                                    </Button>
                                </div>
                                <div className="flex-1 min-h-0 overflow-hidden">
                                    <SidebarMenu className="space-y-1 h-full overflow-y-auto pr-1">
                                        {chats.map((chat) => (
                                            <SidebarMenuItem key={chat.id} className="mb-1">
                                                <div className="flex items-center py-1 w-full gap-1 min-w-0">
                                                    <SidebarMenuButton asChild className="flex-1 min-w-0">
                                                        <button
                                                            type="button"
                                                            className={`w-full text-left p-2 rounded-lg transition-colors min-w-0 ${
                                                                chat.id === activeChatId
                                                                    ? "bg-accent text-accent-foreground"
                                                                    : "hover:bg-muted"
                                                            }`}
                                                            onClick={() =>
                                                                setActiveChatId(chat.id)
                                                            }
                                                        >
                                                            <div className="truncate font-medium text-sm">
                                                                {chat.title}
                                                            </div>
                                                        </button>
                                                    </SidebarMenuButton>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteChat(chat.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </div>
                            </>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup className="flex-1 min-h-0">
                    <SidebarGroupLabel>Documents</SidebarGroupLabel>
                    <SidebarGroupContent className="flex-1 min-h-0 flex flex-col">
                        <div className="px-2 pb-2 flex-shrink-0">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Available Documents ({documents.length})
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {selectedDocuments.length} selected
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <SidebarMenu className="space-y-1 h-full overflow-y-auto pr-1">
                                {documents.slice(0, 8).map((doc) => (
                                    <SidebarMenuItem key={doc.id} className="mb-1">
                                        <div className="flex items-start gap-2 px-2 py-1 rounded hover:bg-muted/50 transition-colors min-w-0">
                                            <Checkbox
                                                checked={selectedDocuments.includes(doc.id)}
                                                onCheckedChange={() => handleDocumentSelect(doc.id)}
                                                className="mt-0.5 flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium truncate">
                                                    {doc.name}
                                                </div>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`text-xs px-1 py-0 ${getCategoryColor(doc.category)}`}
                                                >
                                                    {doc.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    </SidebarMenuItem>
                                ))}
                                {documents.length > 8 && (
                                    <SidebarMenuItem className="mb-1">
                                        <div className="px-2 py-1 text-xs text-muted-foreground text-center">
                                            +{documents.length - 8} more documents
                                        </div>
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarFooter>
                        <div className="py-2 w-full px-2 flex items-center justify-between">
                            <Avatar>
                                <AvatarImage src="#" alt="profile" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <Button variant="outline">
                                    Log Out
                                </Button>
                            </div>
                        </div>
                    </SidebarFooter>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
