"use client";

import React, { useState, useEffect, useRef } from "react";
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { pdf, Document, Page, Text, View, StyleSheet, Image as PDFImage, DocumentProps } from '@react-pdf/renderer';

// Utility function
const numberToWords = (num: number): string => {
  if (num === 0) return "Zero";

  const belowTwenty = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const helper = (n: number): string => {
    if (n < 20) return belowTwenty[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + belowTwenty[n % 10] : "");
    if (n < 1000) return belowTwenty[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + helper(n % 100) : "");
    if (n < 100000) return helper(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + helper(n % 1000) : "");
    if (n < 10000000) return helper(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + helper(n % 100000) : "");
    return helper(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + helper(n % 10000000) : "");
  };

  return helper(num);
};

interface Quotation {
  id: string;
  customerId: string;
  quotationNo: string;
  date: string;
  customerName: string;
  address: string;
  price: string;
  mobileNumber: string;
  batteryCompanyName: string;
  systemType: string;
  kilowatt: string;
  panelCompanyName: string;
  inverterCompanyName: string;
  referredBy: string;
  acWire: string;
  dcWire: string;
  structure: string;
  electricityBillNo: string;
  createdAt: string;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    marginBottom: 5,
  },
  table: {
    marginTop: 20,
    border: '1pt solid black',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    border: '1pt solid black',
    padding: 5,
    flex: 1,
  },
  watermark: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: '100%',
    height: 22,
  },
  footerImage: {
    width: '100%',
    height: 10,
  },
  quotationNo: {
    position: 'absolute',
    top: 40,
    right: 40,
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
  },
});

// PDF Component
const QuotationPDF = ({ form }: { form: any }) => (
  <Document>
    {/* Page 1 */}
    <Page size="A4" style={styles.page}>
      <PDFImage src="/gargeeheader.png" style={styles.headerImage} />
      <Text style={styles.quotationNo}>Quotation No: {form.quotationNo}</Text>
      <View style={{ marginTop: 40 }}>
        <Text style={styles.text}>To,</Text>
        <Text style={styles.text}>Customer Name: <Text style={{ fontWeight: 'bold' }}>{form.customerName}</Text></Text>
        <Text style={styles.text}>Address: {form.address}</Text>
        <Text style={styles.text}>Subject: {form.kilowatt} KW Solar Quotation for Supply & Installation of Rooftop System</Text>
        <Text style={styles.text}>Dear Sir/Madam,</Text>
        <Text style={styles.text}>
          With reference to your requirement, we are pleased to submit our quotation for Supply,
          Installation, Testing & Commissioning of a {form.kilowatt} KW Grid-Connected Solar Rooftop System at your premises.
        </Text>
        <Text style={styles.header}>SYSTEM DETAILS</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>S.No.</Text>
            <Text style={styles.tableCell}>Particulars</Text>
            <Text style={styles.tableCell}>Description</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>1</Text>
            <Text style={styles.tableCell}>System Capacity</Text>
            <Text style={styles.tableCell}>{form.kilowatt} KW ({form.systemType})</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>2</Text>
            <Text style={styles.tableCell}>Solar Panels</Text>
            <Text style={styles.tableCell}>{form.panelCompanyName}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>3</Text>
            <Text style={styles.tableCell}>Inverter</Text>
            <Text style={styles.tableCell}>{form.inverterCompanyName}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>4</Text>
            <Text style={styles.tableCell}>Structure</Text>
            <Text style={styles.tableCell}>{form.structure || "GI / Aluminium Rooftop"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>5</Text>
            <Text style={styles.tableCell}>Generation</Text>
            <Text style={styles.tableCell}>{form.kilowatt ? (() => {
              const kw = parseFloat(form.kilowatt.replace(/[^\d.]/g, '')) || 0;
              const min = kw * 4;
              const max = kw * 5;
              return `${min}–${max} Units per Day`;
            })() : "Units per Day"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>6</Text>
            <Text style={styles.tableCell}>ACDB & DCDB</Text>
            <Text style={styles.tableCell}>Polycab / Havells</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>7</Text>
            <Text style={styles.tableCell}>AC Wire</Text>
            <Text style={styles.tableCell}>{form.acWire || "Polycab (4 sq mm)"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>8</Text>
            <Text style={styles.tableCell}>DC Wire</Text>
            <Text style={styles.tableCell}>{form.dcWire || "Polycab (4 sq mm)"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>9</Text>
            <Text style={styles.tableCell}>Earthing</Text>
            <Text style={styles.tableCell}>Green (4 sq mm)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>10</Text>
            <Text style={styles.tableCell}>Warranty</Text>
            <Text style={styles.tableCell}>Panel: 25+ Years, Inverter: 5–10 Years</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>11</Text>
            <Text style={styles.tableCell}>Battery</Text>
            <Text style={styles.tableCell}>{form.batteryCompanyName}</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <PDFImage src="/gargeefooter.png" style={styles.footerImage} />
      </View>
    </Page>
    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      <PDFImage src="/gargeeheader.png" style={styles.headerImage} />
      <View style={{ marginTop: 40 }}>
        <Text style={styles.header}>PRICE BREAKUP</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{form.kilowatt} KW Solar Rooftop System</Text>
            <Text style={styles.tableCell}>₹ {form.price}/-</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Installation & Commissioning</Text>
            <Text style={styles.tableCell}>Included</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Transportation</Text>
            <Text style={styles.tableCell}>Not Included</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Net Metering Assistance</Text>
            <Text style={styles.tableCell}>Included</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>GST</Text>
            <Text style={styles.tableCell}>Included</Text>
          </View>
          <View style={[styles.tableRow, { fontWeight: 'bold' }]}>
            <Text style={styles.tableCell}>Total Amount Payable</Text>
            <Text style={styles.tableCell}>₹ {form.price}/-</Text>
          </View>
        </View>
        <Text style={styles.text}>(Amount in words: Rupees {numberToWords(parseInt(form.price || '0'))} Only)</Text>
        <Text style={styles.header}>TERMS & CONDITIONS</Text>
        <Text style={styles.text}>Validity of quotation: 1 week</Text>
        <Text style={styles.text}>Installation Timeline: 15–25 Working Days</Text>
        <Text style={styles.text}>Net metering subject to DISCOM approval.</Text>
        <Text style={styles.text}>System generation depends on sunlight & site conditions.</Text>
        <Text style={styles.text}>Payment Terms: 70% Advance, 20% Before Installation, 10% After Commissioning</Text>
        <Text style={styles.text}>Operation & maintenance charges are not included in this price.</Text>
        <Text style={styles.header}>Company Bank Details</Text>
        <Text style={styles.text}>Bank Name: Punjab National Bank</Text>
        <Text style={styles.text}>Account No.: 0347102100000239</Text>
        <Text style={styles.text}>IFSC: PUNB0034710</Text>
        <Text style={styles.text}>Branch: Punjab National Bank,Mehmood Nagar</Text>
        <Text style={styles.header}>DECLARATION</Text>
        <Text style={styles.text}>We hereby declare that the above quotation is true and correct.</Text>
        <Text style={styles.text}>All materials supplied will be new and of standard quality.</Text>
        <Text style={styles.text}>Installation will be carried out as per site conditions and applicable norms.</Text>
        <Text style={styles.text}>Warranties shall be as per manufacturer terms.</Text>
        <Text style={styles.text}>Prices and approvals are subject to applicable rules and regulations.</Text>
        <Text style={styles.text}>Consumer Name: {form.customerName}</Text>
        <PDFImage src="/mohar.png" style={{ width: 55, height: 28, marginTop: 10, alignSelf: 'flex-end' }} />
        <Text style={styles.text}>Authorized Signatory Gargee Solar</Text>
       </View>
       <View style={styles.footer}>
         <PDFImage src="/gargeefooter.png" style={styles.footerImage} />
       </View>
     </Page>
  </Document>
);

export default function QuotationPage() {
  const [isEmployee, setIsEmployee] = useState(false);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const editFormRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    quotationNo: "",
    date: "",
    customerId: "",
    customerName: "",
    address: "",
    price: "",
    mobileNumber: "",
    batteryCompanyName: "",
    systemType: "",
    kilowatt: "",
    panelCompanyName: "",
    inverterCompanyName: "",
    referredBy: "",
    acWire: "",
    dcWire: "",
    structure: "",
    electricityBillNo: "",
  });



  const { isLoading, submitForm } = useFormSubmit();

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const employeeDataStr = sessionStorage.getItem('employeeData');
    if (employeeDataStr) {
      setIsEmployee(true);
      setEmployeeData(JSON.parse(employeeDataStr));
    }

    // Load quotations from Firestore
    let unsubscribe: (() => void) | undefined;

    const loadQuotations = async () => {
      const quotationsRef = collection(db, 'quotations');
      unsubscribe = onSnapshot(quotationsRef, async (snapshot: QuerySnapshot<DocumentData>) => {
        const quotationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Quotation[];

        // Filter quotations based on employee permissions
        let filteredQuotations = quotationsData;

        // Check if user is employee by reading sessionStorage directly
        const employeeDataStr = sessionStorage.getItem('employeeData');
        if (employeeDataStr) {
          const empData = JSON.parse(employeeDataStr);
          // For employees, only show quotations for customers they created
          const customersRef = collection(db, 'customers');
          const customersSnapshot = await getDocs(query(customersRef, where('createdBy', '==', empData.empId)));
          const employeeCustomerIds = customersSnapshot.docs.map(doc => doc.id);

          filteredQuotations = quotationsData.filter(quotation =>
            employeeCustomerIds.includes(quotation.customerId)
          );
        }

        if (mountedRef.current) {
          setQuotations(filteredQuotations.sort((a, b) => a.customerName.localeCompare(b.customerName)));

          // Compute next quotation number
          let nextNumber = 201;
          if (filteredQuotations.length > 0) {
            const numbers = filteredQuotations.map(q => {
              const match = q.quotationNo.match(/^MGE(\d+)$/);
              return match ? parseInt(match[1]) : 200;
            });
            const maxNumber = Math.max(...numbers);
            nextNumber = maxNumber + 1;
          }

          const today = new Date();
          const dateStr = today.toLocaleDateString('en-GB'); // DD/MM/YYYY
          const quotationNo = `MGE${nextNumber}`;
          setForm(prev => ({ ...prev, date: dateStr, quotationNo }));
        }
      });
    };

    loadQuotations().catch(console.error);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchCustomer = async () => {
    if (form.mobileNumber.length === 10) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      try {
        // Build URL with employee ID if user is an employee
        const url = employeeData
          ? `/api/customers/${form.mobileNumber}?employeeId=${employeeData.empId}`
          : `/api/customers/${form.mobileNumber}`;

        const response = await fetch(url, { signal: abortControllerRef.current.signal });
        const data = await response.json();
        if (data.success) {
          const customer = data.customer;
          // Extract only numbers from kilowatt (remove 'kw' text)
          const kilowattValue = customer.kilowatt ? customer.kilowatt.toString().replace(/[^\d.]/g, '') : "";
          if (mountedRef.current) {
            setForm(prev => ({
              ...prev,
              customerId: customer.id,
              customerName: customer.customerName || "",
              address: customer.address || "",
              batteryCompanyName: customer.batteryCompanyName || "",
              systemType: customer.systemType || "",
              kilowatt: kilowattValue,
              panelCompanyName: customer.panelCompanyName || "",
              inverterCompanyName: customer.inverterCompanyName || "",
              referredBy: customer.referredBy || "",
              price: customer.quotationPrice || "",
              acWire: customer.acWire || "",
              dcWire: customer.dcWire || "",
              structure: customer.structure || "",
              electricityBillNo: customer.electricityBillNo || "",
            }));
          }
        } else {
          alert("Customer not found");
          // Reset if not found
          if (mountedRef.current) {
            setForm(prev => ({
              ...prev,
              customerId: "",
              customerName: "",
              address: "",
              batteryCompanyName: "",
              systemType: "",
              kilowatt: "",
              panelCompanyName: "",
              inverterCompanyName: "",
              referredBy: "",
              price: "",
              acWire: "",
              dcWire: "",
              structure: "",
              electricityBillNo: "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        if (!(error instanceof Error) || error.name !== 'AbortError') {
          alert("Error fetching customer");
        }
      }
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };



  const handleEdit = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setForm({
      quotationNo: quotation.quotationNo,
      date: quotation.date,
      customerId: quotation.customerId,
      customerName: quotation.customerName,
      address: quotation.address,
      price: quotation.price,
      mobileNumber: quotation.mobileNumber,
      batteryCompanyName: quotation.batteryCompanyName,
      systemType: quotation.systemType,
      kilowatt: quotation.kilowatt,
      panelCompanyName: quotation.panelCompanyName,
      inverterCompanyName: quotation.inverterCompanyName,
      referredBy: quotation.referredBy,
      acWire: quotation.acWire || "",
      dcWire: quotation.dcWire || "",
      structure: quotation.structure || "",
      electricityBillNo: quotation.electricityBillNo || "",
    });
    setIsEditing(true);
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        await deleteDoc(doc(db, 'quotations', id));
        // Firestore onSnapshot will update the state automatically
      } catch (error) {
        console.error('Error deleting quotation:', error);
        alert('Error deleting quotation');
      }
    }
  };

  const handleSubmit = async () => {
    const submitQuotation = async () => {
      // Check if quotation already exists for this mobile number (only for new quotations)
      if (!isEditing) {
        const normalizedMobile = form.mobileNumber.replace(/\D/g, '');
        const existingQuotation = await getDocs(query(collection(db, 'quotations'), where('mobileNumber', '==', normalizedMobile)));
        if (!existingQuotation.empty) {
          throw new Error('A quotation already exists for this mobile number.');
        }
      }

      const quotationData = {
        ...form,
        mobileNumber: form.mobileNumber.replace(/\D/g, ''),
        createdAt: isEditing && selectedQuotation ? selectedQuotation.createdAt : new Date().toISOString(),
      };

      if (isEditing && selectedQuotation) {
        // Update existing quotation
        const quotationRef = doc(db, 'quotations', selectedQuotation.id);
        await updateDoc(quotationRef, quotationData);
      } else {
        // Add new quotation
        await addDoc(collection(db, 'quotations'), quotationData);
      }
    };

    if (validateForm()) {
      submitForm(
        submitQuotation,
        isEditing ? 'Quotation updated successfully!' : 'Quotation saved successfully!'
      ).then(() => {
        setIsEditing(false);
        setSelectedQuotation(null);
        // Reset form for new quotation (quotationNo and date will be updated by useEffect)
        setForm(prev => ({ ...prev, customerId: "", customerName: "", address: "", batteryCompanyName: "", systemType: "", kilowatt: "", panelCompanyName: "", inverterCompanyName: "", referredBy: "", price: "", acWire: "", dcWire: "", structure: "", electricityBillNo: "" }));
      });
    }
  };

  const validateForm = () => {
    if (!form.customerName.trim()) {
      alert('Customer name is required');
      return false;
    }
    if (!form.mobileNumber.trim()) {
      alert('Mobile number is required');
      return false;
    }
    if (!form.price.trim()) {
      alert('Price is required');
      return false;
    }
    return true;
  };

  const printQuotation = (quotationData?: Quotation) => {
    if (isPrinting) return;
    setIsPrinting(true);

    const element = document.getElementById("pdf-content");

    if (!element) {
      alert("Print content not found");
      setIsPrinting(false);
      return;
    }

    const isMobile = window.innerWidth < 768;
    const dataToUse = quotationData || form;

    if (isMobile) {
      generatePDF(dataToUse);
    } else {
      // For desktop, still update form for HTML print
      const originalForm = { ...form };
      if (quotationData) {
        setForm(quotationData);
        setTimeout(() => performPrint(element, originalForm), 500);
        return;
      }
      performPrint(element, originalForm);
    }

    async function generatePDF(data: any) {
      try {
        const pdfBlob = await pdf(React.createElement(QuotationPDF, { form: data }) as React.ReactElement<DocumentProps>).toBlob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF');
      } finally {
        setIsPrinting(false);
      }
    }

    function performPrint(printElement: HTMLElement, originalForm: any) {
      // Clone the element to avoid modifying the original
      const clonedElement = printElement.cloneNode(true) as HTMLElement;

      // Add print CSS
      const styleOverride = document.createElement('style');
      styleOverride.textContent = `
        @media print {
          * {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #000000 !important;
            font-family: Arial, sans-serif !important;
            page-break-inside: avoid !important;
          }
          p {
            margin: 0 !important;
            padding: 0 !important;
            line-height: 1.4 !important;
          }
          .watermark {
            display: block !important;
          }
          .watermark img {
            opacity: 0.1 !important;
          }
          @page { size: auto; margin: 0; }
        }
      `;
      clonedElement.insertBefore(styleOverride, clonedElement.firstChild);

      // Store original body content
      const originalBody = document.body.innerHTML;

      // Replace body with print content
      document.body.innerHTML = clonedElement.outerHTML;

      // Print
      window.print();

      // Restore original body
      document.body.innerHTML = originalBody;

      // Restore original form data
      if (quotationData) {
        setForm(originalForm);
      }
      setIsPrinting(false);
      window.location.reload();
    }
  };

  return (
    <div className="bg-gray-200 p-6">

      {/* 🔧 FORM - Only visible to admins */}
      {!isEmployee && (
        <div ref={editFormRef} className="max-w-4xl mx-auto bg-white p-4 mb-6 shadow text-sm">
          <h2 className="font-bold mb-3">{isEditing ? 'Edit Quotation' : 'Create New Quotation'}</h2>

        <div className="grid grid-cols-2 gap-2">
          <input name="quotationNo" value={form.quotationNo} onChange={handleChange} className="border p-2" disabled placeholder="Quotation No"/>
          <input name="date" value={form.date} onChange={handleChange} className="border p-2" disabled placeholder="Date"/>
          <div className="col-span-2 flex gap-2">
            <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="Mobile Number" className="border p-2 flex-1"/>
            <button onClick={fetchCustomer} className="bg-blue-500 text-white px-4 py-2">Fetch Customer</button>
          </div>
          <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Customer Name" className="border p-2"/>
          <input name="batteryCompanyName" value={form.batteryCompanyName} onChange={handleChange} placeholder="Battery Company" className="border p-2"/>
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="border p-2"/>
          <input name="kilowatt" value={form.kilowatt} onChange={handleChange} placeholder="Kilowatt" className="border p-2"/>
          <input name="systemType" value={form.systemType} onChange={handleChange} placeholder="System Type" className="border p-2"/>
          <input name="panelCompanyName" value={form.panelCompanyName} onChange={handleChange} placeholder="Panel Company" className="border p-2"/>
          <input name="inverterCompanyName" value={form.inverterCompanyName} onChange={handleChange} placeholder="Inverter Company" className="border p-2"/>
          <input name="referredBy" value={form.referredBy} onChange={handleChange} placeholder="Referred By" className="border p-2"/>
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2"/>
          <input name="acWire" value={form.acWire} onChange={handleChange} placeholder="AC Wire" className="border p-2"/>
          <input name="dcWire" value={form.dcWire} onChange={handleChange} placeholder="DC Wire" className="border p-2"/>
          <input name="electricityBillNo" value={form.electricityBillNo} onChange={handleChange} placeholder="Electricity Bill No" className="border p-2"/>
          <input name="structure" value={form.structure} onChange={handleChange} placeholder="Structure" className="border p-2"/>
        </div>

        <div className="flex gap-4 mt-3">
          <button onClick={() => printQuotation()} className="bg-black text-white px-4 py-2" disabled={isPrinting}>
            {isPrinting ? 'Printing...' : 'Print'}
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2" disabled={isLoading}>
            {isLoading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Quotation' : 'Save Quotation')}
          </button>
        </div>
      </div>
      )}

      {/* 📄 PDF - Always rendered but hidden for employees */}
      <div className={`flex justify-center ${isEmployee ? 'hidden' : ''}`}>
        <div id="pdf-content" className="bg-white">

          {/* ================= PAGE 1 ================= */}
          <div className="w-[794px] h-[1123px] p-6 relative">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/gargeelogonobg.png" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10">
              <img src="/gargeeheader.png" alt="header" width={754} height={50} className="w-full"/>
            </div>

            {/* Quotation Number */}
            <div className="absolute top-6 right-6 text-sm font-bold z-20">
              Quotation No: {form.quotationNo}
            </div>

            {/* TO SECTION */}
            <div className="mt-6 text-sm space-y-1">
              <p>To,</p>
              <p>Customer Name: <strong>{form.customerName}</strong></p>
              <p>Address: {form.address}</p>
               <p>
                 Subject: {form.kilowatt} KW Solar Quotation for Supply & Installation of Rooftop System
               </p>
              <p>Dear Sir/Madam,</p>
            </div>

            {/* BODY TEXT */}
            <p className="mt-4 text-sm">
              With reference to your requirement, we are pleased to submit our quotation for Supply,
              Installation, Testing & Commissioning of a {form.kilowatt} KW Grid-Connected Solar Rooftop System at your premises.
            </p>

            {/* SYSTEM DETAILS */}
            <div className="mt-6 text-sm">
              <h2 className="font-semibold mb-2">SYSTEM DETAILS</h2>

              <table className="w-full border">
                <thead>
                  <tr>
                    <th className="border p-2">S.No.</th>
                    <th className="border p-2">Particulars</th>
                    <th className="border p-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border p-2">1</td><td className="border p-2">System Capacity</td><td className="border p-2">{form.kilowatt} KW ({form.systemType})</td></tr>
                  <tr><td className="border p-2">2</td><td className="border p-2">Solar Panels</td><td className="border p-2">{form.panelCompanyName} </td></tr>
                  <tr><td className="border p-2">3</td><td className="border p-2">Inverter</td><td className="border p-2">{form.inverterCompanyName}</td></tr>
                  <tr><td className="border p-2">4</td><td className="border p-2">Structure</td><td className="border p-2">{form.structure || "GI / Aluminium Rooftop"}</td></tr>
                  <tr><td className="border p-2">5</td><td className="border p-2">Generation</td><td className="border p-2">{form.kilowatt ? (() => {
                    const kw = parseFloat(form.kilowatt.replace(/[^\d.]/g, '')) || 0;
                    const min = kw * 4;
                    const max = kw * 5;
                    return `${min}–${max} Units per Day`;
                  })() : "Units per Day"}</td></tr>
                  <tr><td className="border p-2">6</td><td className="border p-2">ACDB & DCDB</td><td className="border p-2">Polycab / Havells</td></tr>
                  <tr><td className="border p-2">7</td><td className="border p-2">AC Wire</td><td className="border p-2">{form.acWire || "Polycab (4 sq mm)"}</td></tr>
                  <tr><td className="border p-2">8</td><td className="border p-2">DC Wire</td><td className="border p-2">{form.dcWire || "Polycab (4 sq mm)"}</td></tr>
                  <tr><td className="border p-2">9</td><td className="border p-2">Earthing</td><td className="border p-2">Green (4 sq mm)</td></tr>
                  <tr><td className="border p-2">10</td><td className="border p-2">Warranty</td><td className="border p-2">Panel: 25+ Years, Inverter: 5–10 Years</td></tr>
                  <tr><td className="border p-2">11</td><td className="border p-2">Battery</td><td className="border p-2">{form.batteryCompanyName}</td></tr>
                </tbody>
              </table>
            </div>

            {/* FOOTER PAGE 1 */}
            <div className="absolute bottom-6 left-10 right-10">
              <img src="/gargeefooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>

          {/* ================= PAGE 2 ================= */}
          <div className="w-[794px] h-[1123px] p-6 relative">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/gargeelogonobg.png" alt="logo" width={400} height={400}/>
            </div>

             {/* Header Image */}
             <div className="relative z-10 mb-6">
               <img src="/gargeeheader.png" alt="header" width={754} height={50} className="w-full"/>
             </div>

            {/* PRICE BREAKUP */}
            <div className="text-sm">
              <h2 className="font-semibold mb-2">PRICE BREAKUP</h2>

              <table className="w-full border">
                <tbody>
                  <tr><td className="border p-2">{form.kilowatt} KW Solar Rooftop System</td><td className="border p-2">₹ {form.price}/-</td></tr>
                  <tr><td className="border p-2">Installation & Commissioning</td><td className="border p-2">Included</td></tr>
                  <tr><td className="border p-2">Transportation</td><td className="border p-2">Not Included</td></tr>
                  <tr><td className="border p-2">Net Metering Assistance</td><td className="border p-2">Included</td></tr>
                  <tr><td className="border p-2">GST</td><td className="border p-2">Included</td></tr>
                  <tr className="font-bold"><td className="border p-2">Total Amount Payable</td><td className="border p-2">₹ {form.price}/-</td></tr>
                </tbody>
              </table>

              <p className="mt-2">
                (Amount in words: Rupees {numberToWords(parseInt(form.price || '0'))} Only)
              </p>
            </div>

            {/* TERMS AND BANK SIDE BY SIDE */}
            <div className="flex gap-4">
              <div className="flex-1 text-sm">
                <h2 className="font-semibold">TERMS & CONDITIONS</h2>
                <p>Validity of quotation: 1 week</p>
                <p>Installation Timeline: 15–25 Working Days</p>
                <p>Net metering subject to DISCOM approval.</p>
                <p>System generation depends on sunlight & site conditions.</p>
                <p>Payment Terms: 70% Advance, 20% Before Installation, 10% After Commissioning</p>
                <p>Operation & maintenance charges are not included in this price.</p>
              </div>

              <div className="flex-1 text-sm border border-gray-300 p-2 bg-gray-50">
                <h2 className="font-bold">Company Bank Details</h2>
                <p>Bank Name: PUNJAB NATIONAL BANK</p>
                <p>Account No.: 0347102100000239</p>
                <p>IFSC: PUNB0034710</p>
                <p>Branch: PUNJAB NATIONAL BANK, MEHMOOD NAGAR</p>
              </div>
            </div>

            {/* DECLARATION */}
            <div className="mt-2 text-[10px]">
              <h2 className="font-semibold">DECLARATION</h2>
              <p>We hereby declare that the above quotation is true and correct.</p>
              <p>All materials supplied will be new and of standard quality.</p>
              <p>Installation will be carried out as per site conditions and applicable norms.</p>
              <p>Warranties shall be as per manufacturer terms.</p>
              <p>Prices and approvals are subject to applicable rules and regulations.</p>
            </div>

            {/* SIGNATURE */}
            <div className="mt-2 flex justify-between text-sm">
              <div>
                <p>Consumer Name: {form.customerName}</p>
                <p>Signature:</p>
              </div>

              <div className=" text-right">
                <img src="/mohar.png" alt="signature" width={100} height={50} className="mb-2" />
                <p>Authorized Signatory</p>
                <p className="font-semibold">Gargee Solar</p>
              </div>
            </div>

            {/* FOOTER PAGE 2 */}
            <div className="absolute bottom-6 left-10 right-10">
              <img src="/gargeefooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>

          {!isEmployee && (
          <>
          {/* ================= PAGE 3 - AGREEMENT (Part 1) ================= */}
          <div className="w-[794px] min-h-[1123px] p-6 relative flex flex-col" style={{ pageBreakBefore: 'always' }}>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/gargeelogonobg.png" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10">
              <img src="/gargeeheader.png" alt="header" width={754} height={50} className="w-full"/>
            </div>

            {/* AGREEMENT CONTENT - Part 1 */}
            <div className="text-[12px] space-y-1 relative z-10 mt-2 flex-1">
              <p className="text-center text-xs font-bold mb-1">Applicant and the registered/empanelled Vendor for installation of rooftop solar system in II</p>

              <div className="text-center text-xs mb-1">
                <p>This agreement is executed on <strong>{form.date}</strong> for design, installation, commissioning and five years comprehensive maintenance of rooftop solar system to be installed under simplified procedure of Rooftop Solar Program Ph-II</p>
              </div>

              <p className="text-center font-semibold">Between</p>

              <p><strong>{form.customerName}</strong> having residential electricity connection with consumer number from <strong>{form.electricityBillNo}</strong> MADHYANCHAL VIDYUT VITRAN NIGAM LTD. <strong>{form.address}</strong>.</p>

              <p className="text-center font-semibold">AND</p>

              <p><strong>Gargee Enterprises</strong> is registered/ empanelled with the Madhyanchal Vidyut Vitaran Nigam Ltd. and is having registered/functional office at Nai Basti Dhanewa Malihabad Lucknow- Utter Pradesh-226102</p>

              <p>Both Applicant and the Vendor are jointly referred as Parties.</p>

              <p className="font-semibold">Whereas</p>
              <p>The Applicant intends to install rooftop solar system under simplified procedure of Rooftop Solar Program Ph-II of the MNRE.</p>
              <p>The Vendor is registered/empanelled vendor with DISCOM for installation of rooftop solar under MNRE Schemes. The Vendor satisfies all the existing regulation pertaining to electrical safety and license in the respective state and it is not debarred or blacklisted from undertaking any such installations by any state/central Government agency.</p>
              <p>Both the parties are mutually agreed and understand their roles and responsibilities and have no liability to any other agency/firm/stakeholder especially to DISCOM and MNRE.</p>

              <p className="font-semibold mt-1">1- GENERAL TERMS:</p>
              <p>The Applicant hereby represents, and warrants that the Applicant has the sole legal capacity to enter into this Agreement and authorize the construction] installation and commissioning of the Rooftop Solar System ({form.address}) which is inclusive of Balance of System ("BoS") on the Applicant's premises- The Vendor reserves its right to verify ownership of the Applicant Site and Applicant covenants to co-operate and provide all information and documentation required by the Vendor for the same.</p>

              <p><strong>1.1.</strong> Vendor may propose changes to the scope] nature and or schedule of the services being performed under this Agreement- All proposed changes must be mutually agreed between the Parties- If Parties fail to agree on the variation proposed either Party may terminate this Agreement by serving notice as per Clause</p>
              <p><strong>1.2.</strong> The Applicant understands and agrees that future changes in load] electricity usage patterns and/or electricity tariffs may affect the economics of the RTS System and these factors have not been and cannot be considered in any analysis or quotation provided by Vendor or its Authorized Persons (defined below)</p>

              <p className="font-semibold">2- RTS System</p>
              <p><strong>2.1.</strong> Total capacity of RTS System will be minimum {form.kilowatt} kWp-</p>
              <p><strong>2.2.</strong> The Solar modules, inverters and BoS will confirm to minimum specifications and DCR requirement of MNRE.</p>
              <p><strong>2.3.</strong> Solar Module of {form.panelCompanyName} capacity each and 22% efficiency will be procured and installed by the Vendor</p>
              <p><strong>2.4.</strong> Solar inverter {form.inverterCompanyName} Model, {form.kilowatt} kW rated output capacity will be procured and installed by the Vendor</p>
              <p><strong>2.5.</strong> Module mounting structure has to withstand minimum wind load pressure as specified by MNRE. The height of the Structure according maximum of 8 to 9 feet. But the consumer themselves will be responsible for any height beyond that</p>
              <p><strong>2.6.</strong> Other BoS installations shall be as per best industry practice with all safety and protection gears installed by the vendor.</p>

              <p className="font-semibold">3. PRICE AND PAYMENT TERMS</p>
              <p><strong>3.1.</strong> The cost of RTS System will be Rs- {form.price}/- The Applicant shall pay the total cost to the Vendor as under: 20% as an advance on confirmation of the order; 80% against Proforma Invoice (PI) before dispatch of solar panels inverters and other BoS items to be delivered;</p>
              <p><strong>3.2.</strong> The order value and payment terms are fixed and will not be subject to any adjustment except as approved in writing by Vendor.</p>
            </div>

            {/* FOOTER PAGE 3 */}
            <div className="relative z-10 mt-auto pt-2">
              <img src="/gargeefooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>

          {/* ================= PAGE 4 - AGREEMENT (Part 2) ================= */}
          <div className="w-[794px] min-h-[1123px] p-6 relative flex flex-col" style={{ pageBreakBefore: 'always' }}>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/gargeelogonobg.png" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10">
              <img src="/gargeeheader.png" alt="header" width={754} height={50} className="w-full"/>
            </div>

            {/* AGREEMENT CONTENT - Part 2 */}
            <div className="text-[12px] space-y-1 relative z-10 mt-2 flex-1">
              <p className="font-semibold">4. REPRESENTATIONS MADE BY THE APPLICANT:</p>
              <p>The Applicant acknowledges and agrees that:</p>
              <p><strong>4.1.</strong> any timeline or schedule shared by Vendor is only an estimate and Vendor will not be liable for any delay that is not attributable to Vendor;</p>
              <p><strong>4.2.</strong> all information disclosed by the Applicant to Vendor is true and accurate, and acknowledges that Vendor has relied on the information produced by the Applicant;</p>
              <p><strong>4.3.</strong> all descriptive specifications, illustrations, drawings, data, dimensions, quotation, price lists and any advertising material circulated by Vendor are approximate only;</p>
              <p><strong>4.4.</strong> any drawings, specifications and plans composed by Vendor shall require the Applicant's approval within 5 (five) days;</p>
              <p><strong>4.5.</strong> the Applicant shall not use the RTS System other than in accordance with the product manufacturer's specifications;</p>
              <p><strong>4.6.</strong> The Applicant warrants that: all electrical and plumbing infrastructure at the Applicant Site are in conformity with applicable laws; the Applicant has the legal capacity to permit unfettered access to Vendor; the Applicant will provide requisite power, water and storage facilities; the Applicant will ensure shadow free area; Vendor is entitled to permit geo-tagging of the Applicant Site; Vendor is entitled to take photographs for promotional activities.</p>

              <p className="font-semibold">5. MAINTENANCE</p>
              <p><strong>5.1.</strong> Vendor shall provide five-year free workmanship maintenance at least once every quarter.</p>
              <p><strong>5.2.</strong> Vendor shall check all nuts and bolts, fuses, earth resistance and other consumables.</p>
              <p><strong>5.3.</strong> Cleaning is Applicant responsibility as per the dusting frequency.</p>

              <p className="font-semibold">6. ACCESS AND RIGHT OF ENTRY:</p>
              <p><strong>6.1.</strong> The Applicant grants permission to Vendor for feasibility study, storing, installing, inspecting, repairing and maintaining the RTS System.</p>
              <p><strong>6.2.</strong> The Applicant shall ensure third-party consents necessary for access are obtained.</p>

              <p className="font-semibold">7. WARRANTIES:</p>
              <p><strong>7.1.</strong> Product Warranty: The Applicant shall be entitled to manufacturers' warranty.</p>
              <p><strong>7.2.</strong> Installation Warranty: Vendor warrants installations free from workmanship defects for five years.</p>
              <p><strong>7.3.</strong> Solar modules shall have tolerance within +/-5% range, provided the RTS System is properly maintained.</p>
              <p><strong>7.4.</strong> Exceptions: Any attempt by unauthorized person to repair shall disentitle warranty. Vendor not liable for damage due to external causes including accidents, misuse, neglect, Force Majeure.</p>

              <p className="font-semibold">8. PERFORMANCE GUARANTEE</p>
              <p><strong>8.1.</strong> Vendor guarantees minimum system performance ratio of 70% for five years.</p>

              <p className="font-semibold">9. INSURANCE:</p>
              <p><strong>9.1.</strong> Vendor may obtain insurance during transit until commissioning. Thereafter, risk passes to Applicant.</p>
            </div>

            {/* FOOTER PAGE 4 */}
            <div className="relative z-10 mt-auto pt-2">
              <img src="/gargeefooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>

          {/* ================= PAGE 5 - AGREEMENT (Part 3) ================= */}
          <div className="w-[794px] min-h-[1123px] p-6 relative flex flex-col" style={{ pageBreakBefore: 'always' }}>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/gargeelogonobg.png" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10">
              <img src="/gargeeheader.png" alt="header" width={754} height={50} className="w-full"/>
            </div>

            {/* AGREEMENT CONTENT - Part 3 */}
            <div className="text-[12px] space-y-1 relative z-10 mt-2 flex-1">
              <p className="font-semibold">10. CANCELLATION:</p>
              <p><strong>10.1.</strong> Applicant may cancel within 7 days from order confirmation.</p>
              <p><strong>10.2.</strong> After 7 days, cancellation fee of XX% of total order value plus costs incurred.</p>
              <p><strong>10.3.</strong> Applicant cannot cancel after dispatch of RTS System.</p>

              <p className="font-semibold">11. LIMITATION OF LIABILITY AND INDEMNITY:</p>
              <p><strong>11.1.</strong> Vendor's liability is limited to repairing/replacing the RTS System or refund of moneys paid.</p>

              <p className="font-semibold">12. SUSPENSION AND TERMINATION:</p>
              <p><strong>12.1.</strong> If Applicant fails to pay, Vendor may suspend obligations until outstanding amounts are paid.</p>

              <p className="font-semibold">13- NOTICES:</p>
              <p>Any notice shall be in writing, in English, delivered by email or registered post.</p>

              <p className="font-semibold">14. FORCE MAJEURE EVENT:</p>
              <p><strong>14.1.</strong> Neither Party liable for delay due to war, riot, earthquake, fire, flood, pandemic, strikes, acts of government ("Force Majeure Event").</p>

              <p className="font-semibold">15. GOVERNING LAW AND DISPUTE RESOLUTION:</p>
              <p><strong>15.1.</strong> This Agreement shall be governed by the laws of India.</p>
              <p><strong>15.2.</strong> Any dispute shall be resolved by arbitration as per the Arbitration and Conciliation Act, 1996.</p>
              <p><strong>15.3.</strong> The arbitration shall be by a sole arbitrator mutually appointed by the Parties.</p>

              {/* SIGNATURE SECTION */}
              <div className="flex justify-between mt-4 pt-3 border-t">
                <div className="text-center">
                  <p><strong>(Applicant)</strong></p>
                  <p className="mt-6">{form.customerName}</p>
                  <p className="mt-3">Sign: ___________________________</p>
                </div>
                <div className="text-center">
                  <p><strong>M/S Gargee Enterprises</strong></p>
                  <p className="mt-6">(Vendor)</p>
                  <img src="/mohar.png" alt="Authorised Signatory" width={70} height={35} className="mx-auto mt-1" />
                  <p className="mt-1">Sign: ___________________________</p>
                </div>
              </div>

              <div className="mt-2 text-[10px]">
                <p className="font-semibold">Witness:-</p>
                <p>1- ___________________________</p>
                <p>2- ___________________________</p>
              </div>

            </div>

            {/* FOOTER PAGE 5 */}
            <div className="relative z-10 mt-auto pt-2">
              <img src="/gargeefooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>
          </>
          )}
        </div>
      </div>

      {/* QUOTATIONS TABLE - Visible to both admins and employees */}
      <div className="max-w-7xl mx-auto bg-white p-6 shadow mt-6">
        <h2 className="text-2xl font-bold mb-4">Saved Quotations</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          {quotations.map((quotation, index) => (
            <div key={quotation.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm text-muted-foreground">#{index + 1}</span>
                  <h3 className="font-semibold">{quotation.customerName}</h3>
                  <p className="text-sm text-gray-600">{quotation.quotationNo}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => printQuotation(quotation)}
                    className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
                    disabled={isPrinting}
                  >
                    {isPrinting ? 'Printing...' : 'Print'}
                  </button>
                  {!isEmployee && (
                    <>
                      <button
                        onClick={() => handleEdit(quotation)}
                        className="bg-green-500 text-white px-3 py-1 text-sm rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(quotation.id)}
                        className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Mobile:</span> {quotation.mobileNumber}</p>
                <p><span className="font-medium">System:</span> {quotation.kilowatt} KW</p>
                <p><span className="font-medium">Price:</span> ₹{quotation.price}</p>
                <p><span className="font-medium">Date:</span> {new Date(quotation.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No.</TableHead>
                <TableHead>Quotation No</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>System</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation, index) => (
                <TableRow key={quotation.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{quotation.quotationNo}</TableCell>
                  <TableCell>{quotation.customerName}</TableCell>
                  <TableCell>{quotation.mobileNumber}</TableCell>
                  <TableCell>{quotation.kilowatt} KW</TableCell>
                  <TableCell>₹{quotation.price}</TableCell>
                  <TableCell>{new Date(quotation.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          printQuotation(quotation);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        disabled={isPrinting}
                      >
                        {isPrinting ? 'Printing...' : 'Print'}
                      </button>
                      {!isEmployee && (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleEdit(quotation);
                            }}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(quotation.id);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {quotations.length === 0 && (
          <p className="text-center text-gray-500 py-8">No quotations saved yet.</p>
        )}
      </div>
    </div>
  );
}