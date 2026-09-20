"use server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function createOpportunity(formData: FormData) {
  await checkAdmin();
  
  const category = formData.get('category') as string;
  const title = formData.get('title') as string;
  const location = formData.get('location') as string;
  const state = formData.get('state') as string;
  const status = formData.get('status') as string;
  const featured = formData.get('featured') === 'true';
  const description = formData.get('description') as string;
  
  // Generate a basic slug
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

  let coverImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  const file = formData.get('coverImage') as File;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Initialize Supabase Client
    const { createClient } = require('@supabase/supabase-js');
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase credentials in .env");
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Upload to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from('getlands')
      .upload(`covers/${filename}`, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      throw new Error("Failed to upload image to Supabase. Check bucket settings.");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('getlands')
      .getPublicUrl(`covers/${filename}`);

    coverImage = publicUrl;
  }

  const data: any = {
    title,
    slug,
    category,
    location,
    state,
    status,
    coverImage,
    description,
  };

  if (category === 'land') {
    data.price = parseFloat(formData.get('price') as string);
    data.landSize = formData.get('landSize') as string;
    data.documentationStatus = formData.get('documentationStatus') as string;
  } else if (category === 'farm') {
    data.slotPrice = parseFloat(formData.get('slotPrice') as string);
    data.projectedReturn = formData.get('projectedReturn') as string;
    data.returnsFrequency = formData.get('returnsFrequency') as string;
    data.duration = formData.get('duration') as string;
  } else if (category === 'land_banking') {
    data.acquisitionPrice = parseFloat(formData.get('acquisitionPrice') as string);
    data.statedExitValue = parseFloat(formData.get('statedExitValue') as string);
    data.duration = formData.get('duration') as string;
  }

  await prisma.opportunity.create({ data });
  
  redirect('/admin/marketplace');
}

export async function editOpportunity(id: string, formData: FormData) {
  await checkAdmin();
  
  const title = formData.get('title') as string;
  const location = formData.get('location') as string;
  const state = formData.get('state') as string;
  const status = formData.get('status') as string;
  const featured = formData.get('featured') === 'true';
  const description = formData.get('description') as string;
  let coverImage = '';
  const file = formData.get('coverImage') as File;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Initialize Supabase Client
    const { createClient } = require('@supabase/supabase-js');
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase credentials in .env");
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Upload to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from('getlands')
      .upload(`covers/${filename}`, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      throw new Error("Failed to upload image to Supabase. Check bucket settings.");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('getlands')
      .getPublicUrl(`covers/${filename}`);

    coverImage = publicUrl;
  }
  
  const opp = await prisma.opportunity.findUnique({ where: { id } });
  if (!opp) return;

  const data: any = { title, location, state, status, description, featured };
  if (coverImage) data.coverImage = coverImage;

  if (opp.category === 'land') {
    data.price = Number(formData.get('price'));
    data.landSize = formData.get('landSize') as string;
    data.documentationStatus = formData.get('documentationStatus') as string;
  } else if (opp.category === 'farm') {
    data.slotPrice = Number(formData.get('slotPrice'));
    data.projectedReturn = formData.get('projectedReturn') as string;
    data.returnsFrequency = formData.get('returnsFrequency') as string;
    data.duration = formData.get('duration') as string;
  } else if (opp.category === 'land_banking') {
    data.acquisitionPrice = Number(formData.get('acquisitionPrice'));
    data.statedExitValue = Number(formData.get('statedExitValue'));
    data.duration = formData.get('duration') as string;
  }

  await prisma.opportunity.update({
    where: { id },
    data
  });

  redirect('/admin/marketplace');
}

export async function createAnnouncement(formData: FormData) {
  await checkAdmin();
  const title = formData.get('title') as string;
  const message = formData.get('message') as string;
  const type = formData.get('type') as string;
  
  await prisma.announcement.create({
    data: { title, message, type, isActive: true }
  });
  
  redirect('/admin/announcements');
}

export async function approveTransaction(transactionId: string) {
  await checkAdmin();
  
  const tx = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!tx || tx.status !== 'pending') return;

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'success' }
  });

  if (tx.type === 'deposit') {
    // Credit user's wallet
    await prisma.user.update({
      where: { id: tx.userId },
      data: { walletBalance: { increment: tx.amount } }
    });
  } else if (tx.type === 'investment') {
    // If it's a direct bank transfer investment, find the pending holding and activate it
    const holding = await prisma.holding.findFirst({
      where: { userId: tx.userId, status: 'pending', totalAmount: tx.amount },
      orderBy: { dateAcquired: 'desc' }
    });

    if (holding) {
      await prisma.holding.update({
        where: { id: holding.id },
        data: { status: 'active' }
      });
      
      // Update cohort committed amount if holding is tied to a cohort
      if (holding.cohortId) {
        await prisma.cohort.update({
          where: { id: holding.cohortId },
          data: {
            committedAmount: { increment: holding.totalAmount },
            availableAmount: { decrement: holding.totalAmount },
            fundedUnits: { increment: holding.units },
            availableUnits: { decrement: holding.units }
          }
        });
      }
    }

  }
}

export async function rejectTransaction(transactionId: string) {
  await checkAdmin();
  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'failed' }
  });
}

export async function deleteOpportunity(id: string) {
  await checkAdmin();
  await prisma.opportunity.delete({ where: { id } });
  redirect('/admin/marketplace');
}
