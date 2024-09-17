"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchDevices } from "@/lib/leenApi";
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
import { Device } from "@/types/device";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react"; // Make sure to install lucide-react if not already

export default function DevicesPage() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAllDevices() {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching devices...");
        const data = await fetchDevices({ limit: 500 });
        console.log("Fetched data:", data);
        setAllDevices(data.items);
        setFilteredDevices(data.items);
      } catch (error) {
        console.error("Error fetching devices:", error);
        // ... error handling ...
      } finally {
        console.log("Setting isLoading to false");
        setIsLoading(false);
      }
    }

    getAllDevices();
  }, []);

  useEffect(() => {
    const filtered = allDevices.filter((device) =>
      Object.values(device).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredDevices(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [allDevices, searchTerm]);

  const paginatedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDevices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDevices, currentPage]);

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  console.log("Rendering with isLoading:", isLoading);
  console.log("Filtered devices:", filteredDevices.length);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading devices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">
        Devices ({filteredDevices.length})
      </h1>
      <Input
        type="text"
        placeholder="Search devices..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {filteredDevices.length > 0 ? (
        <>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Hostnames</TableHead>
                  <TableHead>OS Version</TableHead>
                  <TableHead>IPv4</TableHead>
                  <TableHead>MAC Addresses</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDevices.map((device, index) => (
                  <TableRow key={`${device.hostnames[0]}-${index}`}>
                    <TableCell>{device.status}</TableCell>
                    <TableCell>{device.hostnames?.join(", ") || ""}</TableCell>
                    <TableCell>{device.os_version}</TableCell>
                    <TableCell>{device.ipv4s?.join(", ") || ""}</TableCell>
                    <TableCell>
                      {device.mac_addresses && device.mac_addresses.length > 0
                        ? device.mac_addresses.join(", ")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {device.last_seen
                        ? format(parseISO(device.last_seen), "PPpp")
                        : "N/A"}
                    </TableCell>
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
        <div>No devices found.</div>
      )}
    </div>
  );
}
