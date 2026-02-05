 
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  MapPin,
  User,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { Report } from "@/types/reports";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface ReportDetailsViewProps {
  report: Report;
}

export function ReportDetailsView({ report }: ReportDetailsViewProps) {
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    setDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const imgWidth = 210;
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`report-${report.id.slice(-6)}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Report Details</h1>
            <p className="text-sm text-muted-foreground">
              Detailed report information and download.
            </p>
          </div>
        </div>
        <Button onClick={downloadPDF} disabled={downloading}>
          <Download className="size-4 mr-2" />
          {downloading ? "Downloading..." : "Download PDF"}
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card ref={reportRef} className="border-none shadow-lg bg-white overflow-hidden pt-0 rounded-none">
          {/* Professional Header */}
          <div className="bg-emerald-700 text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">
                  SURVEY REPORT
                </h1>
                <p className="text-emerald-100 text-sm">Professional Land Surveying Services</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">Smart Surveyor</p>
                <p className="text-xs text-emerald-100">Date: {format(new Date(report.createdAt), "dd MMMM, yyyy", { locale: enUS })}</p>
                <p className="text-xs text-emerald-100">Report ID: #{report.id.slice(-6)}</p>
              </div>
            </div>
          </div>

          <CardContent className="space-y-8">
            {/* Section 1: Client & Project Info */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                  <User className="size-4" /> Client Information
                </h3>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-900">{report.client.name}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="size-3" /> {report.client.phone}
                  </p>
                  <p className="text-sm text-gray-600">{report.client.email || ""}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="size-4" /> Location Details
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Mouza:</span> {report.mouzaName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Plot No:</span> {report.plotNo}
                  </p>
                  {report.booking?.propertyAddress && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">Address:</span> {report.booking.propertyAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator className="bg-emerald-100" />

            {/* Section 2: Measurement Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                Measurement Summary
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium mb-1 uppercase">Square Feet</p>
                  <p className="text-2xl font-black text-emerald-900">{report.areaSqFt}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium mb-1 uppercase">Katha</p>
                  <p className="text-2xl font-black text-emerald-900">{report.areaKatha}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium mb-1 uppercase">Decimal</p>
                  <p className="text-2xl font-black text-emerald-900">{report.areaDecimal}</p>
                </div>
              </div>
            </div>

            {/* Section 3: Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                Survey Description
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2">{report.title}</h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {report.content}
                </p>
              </div>
            </div>

            {/* Section 4: Image Attachment */}
            {report.fileUrl && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                  Survey Map / Attachment
                </h3>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={report.fileUrl}
                    alt="Survey Map"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Section 5: Notes */}
            {report.notes && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                  Additional Notes
                </h3>
                <p className="text-sm text-gray-600 italic">
                  {report.notes}
                </p>
              </div>
            )}

            {/* Footer Signature Area */}
            <div className="pt-12 flex justify-between items-end">
              <div className="text-[10px] text-gray-400">
                Generated by Smart Surveyor Management System
              </div>
              <div className="text-center w-48">
                <div className="border-t text-gray-400 border-gray-900 pt-2 font-bold text-sm uppercase">
                  Surveyor Signature
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
