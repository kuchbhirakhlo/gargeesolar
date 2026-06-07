import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: Request, { params }: { params: Promise<{ mobile: string }> }) {
  try {
    const { mobile } = await params;
    const normalizedMobile = mobile.replace(/\D/g, ''); // Keep only digits
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('mobileNumber', '==', normalizedMobile));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Customer not found in customers collection, try fetching from leads collection
      const leadsRef = collection(db, 'leads');
      const leadsQuery = query(leadsRef, where('phone', '==', normalizedMobile));
      const leadsSnapshot = await getDocs(leadsQuery);
      
      if (!leadsSnapshot.empty) {
        // Found lead from messages page - use name, kw, and city
        const lead = leadsSnapshot.docs[0].data();
        const kilowattValue = lead.kw ? lead.kw.toString().replace(/[^\d.]/g, '') : "";
        
        return NextResponse.json({
          success: true,
          customer: {
            id: leadsSnapshot.docs[0].id,
            customerName: lead.name || "",
            address: lead.city || "", // Use City as Address
            kilowatt: kilowattValue,
            batteryCompanyName: "",
            systemType: "",
            panelCompanyName: "",
            inverterCompanyName: "",
            referredBy: "",
            quotationPrice: "",
            mobileNumber: normalizedMobile,
          }
        });
      }
      
      return NextResponse.json({
        success: false,
        error: 'Customer not found'
      }, { status: 404 });
    }

    // If employee ID is provided, filter results by createdBy field
    const customers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    let customer;
    if (employeeId) {
      const filtered = customers.filter(c => (c as any).createdBy === employeeId);
      if (filtered.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Customer not found'
        }, { status: 404 });
      }
      customer = filtered[0];
    } else {
      customer = customers[0];
    }

    return NextResponse.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch customer',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}