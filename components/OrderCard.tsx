"use client";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  pickupTime: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  new: { label: "NEW", bg: "bg-[#FFD600]/15", text: "text-[#FFD600]" },
  confirmed: { label: "CONFIRMED", bg: "bg-[#3B82F6]/15", text: "text-[#3B82F6]" },
  preparing: { label: "PREPARING", bg: "bg-[#8B5CF6]/15", text: "text-[#8B5CF6]" },
  ready: { label: "READY", bg: "bg-[#22C55E]/15", text: "text-[#22C55E]" },
  done: { label: "DONE", bg: "bg-[#71717a]/15", text: "text-[#71717a]" },
};

const actionConfig: Record<
  string,
  { label: string; nextStatus: string; bg: string; hover: string }
> = {
  new: {
    label: "ACCEPT",
    nextStatus: "confirmed",
    bg: "bg-[#22C55E]",
    hover: "hover:bg-[#16a34a]",
  },
  confirmed: {
    label: "PREPARING",
    nextStatus: "preparing",
    bg: "bg-[#FFD600]",
    hover: "hover:brightness-110",
  },
  preparing: {
    label: "MARK READY",
    nextStatus: "ready",
    bg: "bg-[#f97316]",
    hover: "hover:bg-[#ea580c]",
  },
  ready: {
    label: "DONE",
    nextStatus: "done",
    bg: "bg-[#71717a]",
    hover: "hover:bg-[#52525b]",
  },
};

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const status = statusConfig[order.status] ?? statusConfig.new;
  const action = actionConfig[order.status];

  const whatsappLink = `https://wa.me/91${order.phone.replace(/\D/g, "").slice(-10)}`;

  const formattedTime = (() => {
    try {
      return new Date(order.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return order.createdAt;
    }
  })();

  return (
    <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-lg text-[#FFD600] tracking-wider leading-none">
            #{order.orderId}
          </p>
          <p className="text-sm text-[#e4e4e7] mt-1">{order.customerName}</p>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}
        >
          {status.label}
        </span>
      </div>

      {/* Phone */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-[#22C55E] hover:underline"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.105-1.132l-.29-.174-3.012.79.806-2.942-.19-.302A7.96 7.96 0 014 12a8 8 0 1116 0 8 8 0 01-8 8z" />
        </svg>
        {order.phone}
      </a>

      {/* Items */}
      <ul className="space-y-1">
        {order.items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between text-xs text-[#e4e4e7]"
          >
            <span>
              {item.quantity}x {item.name}
            </span>
            <span className="font-mono text-[#71717a]">
              ₹{item.price * item.quantity}
            </span>
          </li>
        ))}
      </ul>

      {/* Meta row */}
      <div className="flex items-center justify-between text-[11px] text-[#71717a] border-t border-[#27272a] pt-2">
        <span>Pickup: {order.pickupTime}</span>
        <span>{order.paymentMethod}</span>
        <span>{formattedTime}</span>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#71717a]">Total</span>
        <span className="font-display text-xl text-[#FFD600]">
          ₹{order.total}
        </span>
      </div>

      {/* Action button */}
      {action && (
        <button
          onClick={() => onStatusChange(order.orderId, action.nextStatus)}
          className={`w-full py-2.5 rounded-xl font-bold text-sm text-[#09090b] active:scale-[0.97] transition-all ${action.bg} ${action.hover}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
