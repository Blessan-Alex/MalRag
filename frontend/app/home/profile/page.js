"use client";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Bell,
    Palette,
    Globe,
    Camera,
    Save,
    Edit3,
} from "lucide-react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        bio: "Passionate developer with a love for creating amazing user experiences. Always learning and exploring new technologies.",
        website: "https://johndoe.dev",
        timezone: "PST",
        language: "English",
        notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false,
        },
        preferences: {
            theme: "system",
            compactMode: false,
            showOnlineStatus: true,
        },
    });

    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNestedInputChange = (parent, field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value,
            },
        }));
    };

    const handleSave = () => {
        // Here you would typically save to your backend
        console.log("Saving profile data:", profileData);
        setIsEditing(false);
        // Show success message
    };


    return (
        <div className="pt-8 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Profile
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage your account settings and preferences
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">Log Out</Button>
                    </div>
                </div>
            </div>

            {/* Profile Tabs */}
            <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                        value="personal"
                        className="flex items-center gap-2"
                    >
                        <User className="h-4 w-4" />
                        Personal
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="flex items-center gap-2"
                    >
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="flex items-center gap-2"
                    >
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="preferences"
                        className="flex items-center gap-2"
                    >
                        <Palette className="h-4 w-4" />
                        Preferences
                    </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Personal Information
                                    </CardTitle>
                                    <CardDescription>
                                        Update your personal details and profile
                                        information
                                    </CardDescription>
                                </div>
                                <Button
                                    variant={isEditing ? "default" : "outline"}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? (
                                        <Save className="h-4 w-4 mr-2" />
                                    ) : (
                                        <Edit3 className="h-4 w-4 mr-2" />
                                    )}
                                    {isEditing
                                        ? "Save Changes"
                                        : "Edit Profile"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Profile Picture Section */}
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        src="/api/placeholder/96/96"
                                        alt="Profile"
                                    />
                                    <AvatarFallback className="text-lg">
                                        JD
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <Camera className="h-4 w-4" />
                                        Change Photo
                                    </Button>
                                    <p className="text-sm text-gray-500">
                                        JPG, GIF or PNG. 1MB max.
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="name"
                                        className="flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="flex items-center gap-2"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="phone"
                                        className="flex items-center gap-2"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={profileData.phone}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="location"
                                        className="flex items-center gap-2"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        value={profileData.location}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "location",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                        placeholder="Enter your location"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="website"
                                        className="flex items-center gap-2"
                                    >
                                        <Globe className="h-4 w-4" />
                                        Website
                                    </Label>
                                    <Input
                                        id="website"
                                        value={profileData.website}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "website",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="timezone"
                                        className="flex items-center gap-2"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        Timezone
                                    </Label>
                                    <Select
                                        value={profileData.timezone}
                                        onValueChange={(value) =>
                                            handleInputChange("timezone", value)
                                        }
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PST">
                                                Pacific Standard Time
                                            </SelectItem>
                                            <SelectItem value="MST">
                                                Mountain Standard Time
                                            </SelectItem>
                                            <SelectItem value="CST">
                                                Central Standard Time
                                            </SelectItem>
                                            <SelectItem value="EST">
                                                Eastern Standard Time
                                            </SelectItem>
                                            <SelectItem value="UTC">
                                                UTC
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={profileData.bio}
                                    onChange={(e) =>
                                        handleInputChange("bio", e.target.value)
                                    }
                                    disabled={!isEditing}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security Settings
                            </CardTitle>
                            <CardDescription>
                                Manage your password and security preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">
                                        Current Password
                                    </Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">
                                        New Password
                                    </Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <Button>Update Password</Button>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium">
                                    Two-Factor Authentication
                                </h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            Enable 2FA
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Add an extra layer of security to
                                            your account
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>
                                Choose how you want to be notified about updates
                                and activities
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            Email Notifications
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Receive notifications via email
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            profileData.notifications.email
                                        }
                                        onCheckedChange={(checked) =>
                                            handleNestedInputChange(
                                                "notifications",
                                                "email",
                                                checked
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            Push Notifications
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Receive push notifications in your
                                            browser
                                        </p>
                                    </div>
                                    <Switch
                                        checked={profileData.notifications.push}
                                        onCheckedChange={(checked) =>
                                            handleNestedInputChange(
                                                "notifications",
                                                "push",
                                                checked
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            SMS Notifications
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Receive notifications via SMS
                                        </p>
                                    </div>
                                    <Switch
                                        checked={profileData.notifications.sms}
                                        onCheckedChange={(checked) =>
                                            handleNestedInputChange(
                                                "notifications",
                                                "sms",
                                                checked
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            Marketing Emails
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Receive promotional emails and
                                            updates
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            profileData.notifications.marketing
                                        }
                                        onCheckedChange={(checked) =>
                                            handleNestedInputChange(
                                                "notifications",
                                                "marketing",
                                                checked
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                App Preferences
                            </CardTitle>
                            <CardDescription>
                                Customize your app experience and interface
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="theme">Theme</Label>
                                    <Select
                                        value={profileData.preferences.theme}
                                        onValueChange={(value) =>
                                            handleNestedInputChange(
                                                "preferences",
                                                "theme",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">
                                                Light
                                            </SelectItem>
                                            <SelectItem value="dark">
                                                Dark
                                            </SelectItem>
                                            <SelectItem value="system">
                                                System
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select
                                        value={profileData.language}
                                        onValueChange={(value) =>
                                            handleInputChange("language", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="English">
                                                English
                                            </SelectItem>
                                            <SelectItem value="Spanish">
                                                Spanish
                                            </SelectItem>
                                            <SelectItem value="French">
                                                French
                                            </SelectItem>
                                            <SelectItem value="German">
                                                German
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            Compact Mode
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Use a more compact interface layout
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            profileData.preferences.compactMode
                                        }
                                        onCheckedChange={(checked) =>
                                            handleNestedInputChange(
                                                "preferences",
                                                "compactMode",
                                                checked
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            Show Online Status
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Let others see when you're online
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            profileData.preferences
                                                .showOnlineStatus
                                        }
                                        onCheckedChange={(checked) =>
                                            handleNestedInputChange(
                                                "preferences",
                                                "showOnlineStatus",
                                                checked
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium text-red-600">
                                    Danger Zone
                                </h4>
                                <div className="space-y-2">
                                    <Button variant="destructive" size="sm">
                                        Delete Account
                                    </Button>
                                    <p className="text-sm text-gray-500">
                                        Permanently delete your account and all
                                        associated data. This action cannot be
                                        undone.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
