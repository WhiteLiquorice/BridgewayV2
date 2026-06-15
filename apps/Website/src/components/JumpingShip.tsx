import React, { useState } from 'react';

const COMPETITORS = [
  {
    id: 'mindbody',
    name: 'Mindbody',
    logo: '🧘',
    whatToExport: 'Mailing Lists / Client Directory',
    steps: [
      'Log into your Mindbody account and navigate to the "Reports" tab.',
      'Click on "Clients" in the left sidebar, then select "Mailing Lists".',
      'Set the filters to retrieve all clients (ensure "Client\'s Opt-in Status" is set to "All Clients" or "All Records").',
      'Click "Generate" to compile the roster list.',
      'Click the "Export to Excel" icon next to the search result grid, then save the file on your device in .csv format.'
    ]
  },
  {
    id: 'jane',
    name: 'Jane App',
    logo: '🌿',
    whatToExport: 'Patient List / Client List',
    steps: [
      'Log into Jane and select "Reports" from the left navigation pane.',
      'Click on the "List" option located under the "Patients" or "Clients" section.',
      'Ensure the filter is set to display "All Patients" (including inactive ones if you wish to migrate them).',
      'Click the "Export" button in the upper right-hand corner of the report.',
      'Choose the "CSV" option to download your complete roster.'
    ]
  },
  {
    id: 'boulevard',
    name: 'Boulevard',
    logo: '🏢',
    whatToExport: 'Clients Report',
    steps: [
      'Open Boulevard and head to the "Reports" page.',
      'Search for and select the "Clients" report.',
      'Verify columns (e.g., Name, Email, Phone, Notes) are enabled in your grid settings.',
      'Click the "Export" action button at the top-right of the table.',
      'Download the export as a standard CSV spreadsheet.'
    ]
  },
  {
    id: 'vagaro',
    name: 'Vagaro',
    logo: '💅',
    whatToExport: 'Customer Roster list',
    steps: [
      'Log into Vagaro and navigate to "Reports" > "Customers" > "Customer List".',
      'Leave filters broad to capture your entire customer base.',
      'Click "Search" to fetch all user records.',
      'Click the green "Export" (Excel/CSV) icon situated at the top of the customer grid to save the sheet.'
    ]
  },
  {
    id: 'acuity',
    name: 'Acuity / Squarespace',
    logo: '📅',
    whatToExport: 'Export Clients list',
    steps: [
      'Log into Acuity Scheduling and go to the "Import/Export" tab under settings.',
      'Click on the "Export Clients" option.',
      'Click the "Export Clients" button to download your .csv file directly containing all client profiles.'
    ]
  }
];

export default function JumpingShip() {
  const [selectedComp, setSelectedComp] = useState(COMPETITORS[0]);

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] font-sans text-neutral-800">
      <div className="mb-8 border-b border-neutral-100 pb-6">
        <h2 className="font-serif text-3xl text-neutral-900 leading-tight">Jumping Ship to Bridgeway?</h2>
        <p className="text-sm text-neutral-500 mt-2 font-light max-w-2xl">
          Migrating your business is simple. Below is our comprehensive exporter guide to fetch client records from the 5 leading competitors, and how to import them straight into your Bridgeway admin panel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Competitor Navigation */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-450 mb-3 pl-1">1. Choose Your Old System</p>
          <div className="flex flex-col gap-1.5">
            {COMPETITORS.map((comp) => {
              const isSelected = selectedComp.id === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComp(comp)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-neutral-900 font-semibold'
                      : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                  }`}
                >
                  <span className="text-lg">{comp.logo}</span>
                  <span className="text-sm">{comp.name}</span>
                  {isSelected && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Step-by-Step Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-6 md:p-8 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">2. How to Export from {selectedComp.name}</p>
              <h3 className="font-serif text-xl text-neutral-900 mt-1">Exporting your "{selectedComp.whatToExport}"</h3>
            </div>

            <ol className="space-y-4">
              {selectedComp.steps.map((step, idx) => (
                <li key={idx} className="flex gap-4 items-start text-sm text-neutral-600 leading-relaxed">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-700 text-xs font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Import Guide Section */}
          <div className="border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 bg-neutral-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-[#080f1d] shadow-lg shadow-amber-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium">3. Import into Bridgeway</h3>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Once you have your `.csv` file ready, log into the <strong>Bridgeway Admin Dashboard</strong>. Go to your <strong>Clients</strong> tab, click the <strong>Client Importer</strong> button, drag in your CSV, and match the columns to import your roster seamlessly.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-500 font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Organisations are mapped automatically
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
