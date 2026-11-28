import { PopoverCard } from "@/components/molecules/PopoverCard";
import { PopoverItem } from "@/components/molecules/PopoverItem";

const MESSAGES = [
  {
    title: "Konfirmasi Pembayaran Lisensi",
    description: "Warung Sambal Jaya (Cabang Margonda) telah mengirim bukti transfer Rp30.000.",
  },
  {
    title: "Laporan Harian Cabang Kemang",
    description: "Kasir menutup shift pagi dengan selisih tunai Rp0.",
  },
];

export function InboxPopover() {
  return (
    <PopoverCard title="PESAN MASUK" width="w-[300px]">
      <div className="space-y-1 text-[12.5px]">
        {MESSAGES.map((m) => (
          <PopoverItem key={m.title} title={m.title} description={m.description} />
        ))}
      </div>
    </PopoverCard>
  );
}
