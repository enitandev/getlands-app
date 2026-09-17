"use strict";
"use client";

import React from 'react';
import { deleteOpportunity } from '@/app/actions/admin';

export default function ClientAdminMarketplaceDelete({ id }: { id: string }) {
  return (
    <button 
      className="text-[13px] font-bold text-[#e53935] hover:underline transition-colors" 
      onClick={() => {
        if(window.confirm('Are you sure you want to delete this opportunity?')) {
          deleteOpportunity(id);
        }
      }}
    >
      Delete
    </button>
  );
}
