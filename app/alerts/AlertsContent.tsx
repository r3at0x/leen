"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchAlerts } from "@/lib/leenApi";
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

export default function AlertsContent() {
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [error, setError] = useState<string | null>(null);

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
    const filtered = allAlerts.filter((alert) =>
      Object.values(alert).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredAlerts(filtered);
    setCurrentPage(1);
  }, [allAlerts, searchTerm]);

  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAlerts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAlerts, currentPage]);

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
      <Input
        type="text"
        placeholder="Search alerts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
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
