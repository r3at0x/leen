"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchAlerts } from "@/lib/leen-api";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert } from "@/types/alert";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Add this new interface
interface FilterOptions {
  severity: string;
  status: string;
  vendor: string;
}

export default function AlertsContent() {
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    severity: "all",
    status: "all",
    vendor: "all",
  });

  useEffect(() => {
    async function getAllAlerts() {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching alerts...");
        const data = await fetchAlerts({ limit: 500 });
        console.log("Fetched data:", data);
        setAllAlerts(data.items);
        setFilteredAlerts(data.items);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        if (error instanceof AxiosError) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        console.log("Setting isLoading to false");
        setIsLoading(false);
      }
    }

    getAllAlerts();
  }, []);

  useEffect(() => {
    const filtered = allAlerts.filter((alert) => {
      const matchesSearch = Object.values(alert).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesSeverity =
        filterOptions.severity === "all" ||
        alert.severity === filterOptions.severity;
      const matchesStatus =
        filterOptions.status === "all" || alert.status === filterOptions.status;
      const matchesVendor =
        filterOptions.vendor === "all" || alert.vendor === filterOptions.vendor;

      return matchesSearch && matchesSeverity && matchesStatus && matchesVendor;
    });
    setFilteredAlerts(filtered);
    setCurrentPage(1);
  }, [allAlerts, searchTerm, filterOptions]);

  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAlerts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAlerts, currentPage]);

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilterOptions((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilterOptions({ severity: "all", status: "all", vendor: "all" });
    setSearchTerm("");
  };

  console.log("Rendering with isLoading:", isLoading);
  console.log("Filtered alerts:", filteredAlerts.length);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold mb-5">
        Alerts ({filteredAlerts.length})
      </h1>
      <div className="flex space-x-4 mb-4">
        <Input
          type="text"
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select
          value={filterOptions.severity}
          onValueChange={(value) => handleFilterChange("severity", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterOptions.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="unresolved">Unresolved</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterOptions.vendor}
          onValueChange={(value) => handleFilterChange("vendor", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vendor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            {/* Add vendor options dynamically based on your data */}
          </SelectContent>
        </Select>
        <Button onClick={clearFilters}>Clear Filters</Button>
      </div>
      {filteredAlerts.length > 0 ? (
        <>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>First Event Time</TableHead>
                  <TableHead>Last Event Time</TableHead>
                  <TableHead>Vendor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.title}</TableCell>
                    <TableCell>{alert.severity}</TableCell>
                    <TableCell>{alert.status}</TableCell>
                    <TableCell>
                      {alert.first_event_time
                        ? format(parseISO(alert.first_event_time), "PPpp")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {alert.last_event_time
                        ? format(parseISO(alert.last_event_time), "PPpp")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{alert.vendor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage === 1}
                  />
                ) : (
                  <PaginationPrevious
                    aria-disabled="true"
                    className="pointer-events-none opacity-50"
                  />
                )}
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <div>No alerts found.</div>
      )}
    </div>
  );
}
