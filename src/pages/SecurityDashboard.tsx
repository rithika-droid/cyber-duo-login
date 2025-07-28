import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Trash2, Search, ArrowUpDown } from "lucide-react";

interface WhitelistedIP {
  id: string;
  address: string;
}

const SecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState("Whitelisted IPs");
  const [whitelistedIPs, setWhitelistedIPs] = useState<WhitelistedIP[]>([
    { id: "1", address: "127.0.0.1" },
    { id: "2", address: "192.168.24.48" },
    { id: "3", address: "192.168.1.100" },
    { id: "4", address: "10.0.0.5" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const navigationTabs = [
    "Audit Log",
    "All Login Attempts",
    "Security Events",
    "Blocked IPs",
    "Whitelisted IPs"
  ];

  const removeIP = (id: string) => {
    setWhitelistedIPs(prev => prev.filter(ip => ip.id !== id));
  };

  const filteredAndSortedIPs = useMemo(() => {
    let filtered = whitelistedIPs.filter(ip => {
      const matchesSearch = ip.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterRange === "All" || 
        (filterRange === "127.*" && ip.address.startsWith("127.")) ||
        (filterRange === "192.*" && ip.address.startsWith("192.")) ||
        (filterRange === "10.*" && ip.address.startsWith("10."));
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      const aNum = a.address.split('.').map(num => parseInt(num.padStart(3, '0'))).join('');
      const bNum = b.address.split('.').map(num => parseInt(num.padStart(3, '0'))).join('');
      return sortOrder === "asc" ? aNum.localeCompare(bNum) : bNum.localeCompare(aNum);
    });
  }, [whitelistedIPs, searchTerm, filterRange, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Security Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-1 py-2">
            {navigationTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Whitelisted IPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search IP addresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRange} onValueChange={setFilterRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Ranges</SelectItem>
                  <SelectItem value="127.*">127.*</SelectItem>
                  <SelectItem value="192.*">192.*</SelectItem>
                  <SelectItem value="10.*">10.*</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={toggleSort} className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>

            {filteredAndSortedIPs.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">IP Address</TableHead>
                      <TableHead className="font-semibold text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedIPs.map((ip) => (
                      <TableRow key={ip.id}>
                        <TableCell className="font-mono">{ip.address}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeIP(ip.id)}
                            className="h-8 px-3"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  {whitelistedIPs.length === 0 ? "No whitelisted IPs found" : "No IPs match your search"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {whitelistedIPs.length === 0 
                    ? "All IP addresses have been removed from the whitelist" 
                    : "Try adjusting your search or filter criteria"
                  }
                </p>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-6 pt-4 border-t">
              <Button variant="secondary" onClick={() => window.history.back()}>
                Back to Credential Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SecurityDashboard;