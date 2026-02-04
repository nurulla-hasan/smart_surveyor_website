"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Pencil, FileDown } from "lucide-react";
import { Report } from "@/types/reports";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import { deleteReport } from "@/services/reports";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import Link from "next/link";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface ReportActionsProps {
  report: Report;
}

export function ReportActions({ report }: ReportActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [open, setOpen] = useState(false);

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Create a hidden container for the PDF content
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "800px"; // Fixed width for consistent PDF generation
      document.body.appendChild(container);

      // Simple HTML structure for PDF (similar to ReportDetailsView)
      container.innerHTML = `
        <div style="padding: 40px; font-family: sans-serif; background: white; color: #111;">
          <div style="background: #047857; color: white; padding: 30px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">SURVEY REPORT</h1>
                <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Professional Land Surveying Services</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-weight: bold; font-size: 18px;">Smart Surveyor</p>
                <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.9;">Date: ${format(new Date(report.createdAt), "dd MMMM, yyyy", { locale: enUS })}</p>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
            <div>
              <h3 style="color: #047857; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px;">Client Information</h3>
              <p style="margin: 0; font-size: 16px; font-weight: bold;">${report.client.name}</p>
              <p style="margin: 5px 0 0; font-size: 14px; color: #4b5563;">${report.client.phone || ""}</p>
            </div>
            <div>
              <h3 style="color: #047857; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px;">Location Details</h3>
              <p style="margin: 0; font-size: 14px; color: #4b5563;"><span style="font-weight: bold; color: #111;">Mouza:</span> ${report.mouzaName}</p>
              <p style="margin: 5px 0 0; font-size: 14px; color: #4b5563;"><span style="font-weight: bold; color: #111;">Plot No:</span> ${report.plotNo}</p>
            </div>
          </div>

          <div style="margin-bottom: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <h3 style="color: #047857; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px;">Measurement Summary</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #d1fae5;">
                <p style="margin: 0 0 5px; font-size: 10px; color: #059669; font-weight: bold; text-transform: uppercase;">Square Feet</p>
                <p style="margin: 0; font-size: 20px; font-weight: 900; color: #064e3b;">${report.areaSqFt}</p>
              </div>
              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #d1fae5;">
                <p style="margin: 0 0 5px; font-size: 10px; color: #059669; font-weight: bold; text-transform: uppercase;">Katha</p>
                <p style="margin: 0; font-size: 20px; font-weight: 900; color: #064e3b;">${report.areaKatha}</p>
              </div>
              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #d1fae5;">
                <p style="margin: 0 0 5px; font-size: 10px; color: #059669; font-weight: bold; text-transform: uppercase;">Decimal</p>
                <p style="margin: 0; font-size: 20px; font-weight: 900; color: #064e3b;">${report.areaDecimal}</p>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #047857; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px;">Survey Description</h3>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #f3f4f6;">
              <h4 style="margin: 0 0 10px; font-weight: bold; color: #111;">${report.title}</h4>
              <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.5; white-space: pre-wrap;">${report.content}</p>
            </div>
          </div>

          ${report.fileUrl ? `
            <div style="margin-bottom: 30px;">
              <h3 style="color: #047857; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px;">Survey Map / Attachment</h3>
              <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #f9fafb;">
                <img src="${report.fileUrl}" style="width: 100%; max-height: 400px; object-fit: contain;" />
              </div>
            </div>
          ` : ""}

          <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 10px; color: #9ca3af;">Generated by Smart Surveyor Management System</div>
            <div style="width: 180px; text-align: center;">
              <div style="border-top: 1px solid #111; padding-top: 10px; font-weight: bold; font-size: 12px; text-transform: uppercase;">Surveyor Signature</div>
            </div>
          </div>
        </div>
      `;

      const dataUrl = await toPng(container, {
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
      
      document.body.removeChild(container);
      SuccessToast("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation failed:", error);
      ErrorToast("Problem creating PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteReport(report.id);
      if (res?.success) {
        SuccessToast("Report deleted successfully");
        setOpen(false);
      } else {
        ErrorToast(res?.message || "Problem deleting report");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/dashboard/reports/${report.id}`}>
        <Button variant="ghost" size="icon-sm" className="hover:text-foreground">
          <Eye />
        </Button>
      </Link>
      <Link href={`/dashboard/reports/${report.id}/edit`}>
        <Button variant="ghost" size="icon-sm" className="hover:text-primary">
          <Pencil />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon-sm"
        className="hover:text-emerald-600"
        onClick={downloadPDF}
        disabled={isDownloading}
      >
        <FileDown className={isDownloading ? "animate-pulse" : ""} />
      </Button>
      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        title="Are you sure?"
        description="This report will be permanently deleted and cannot be recovered."
        onConfirm={handleDelete}
        isLoading={isDeleting}
        trigger={
          <Button variant="ghost" size="icon-sm" className="hover:text-destructive">
            <Trash2 />
          </Button>
        }
      />
    </div>
  );
}
