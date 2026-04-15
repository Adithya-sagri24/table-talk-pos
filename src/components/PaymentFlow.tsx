import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Globe, DollarSign, Check, Loader2, Wifi, QrCode, ShieldCheck } from 'lucide-react';

type PaymentMethod = 'cash' | 'card' | 'upi' | 'online';
type PaymentStage = 'idle' | 'waiting' | 'processing' | 'success';

interface PaymentFlowProps {
  method: PaymentMethod;
  amount: number;
  onComplete: () => void;
  onCancel: () => void;
}

export function PaymentFlow({ method, amount, onComplete, onCancel }: PaymentFlowProps) {
  const [stage, setStage] = useState<PaymentStage>('idle');

  const startPayment = () => {
    setStage('waiting');
    const waitTime = method === 'cash' ? 1200 : 2200;
    const processTime = method === 'cash' ? 800 : 1800;

    setTimeout(() => setStage('processing'), waitTime);
    setTimeout(() => {
      setStage('success');
      setTimeout(onComplete, 1200);
    }, waitTime + processTime);
  };

  useEffect(() => {
    setStage('idle');
  }, [method]);

  if (stage === 'success') return <SuccessScreen amount={amount} method={method} />;

  return (
    <div className="animate-fade-in">
      {method === 'card' && <CardPOSFlow stage={stage} onStart={startPayment} onCancel={onCancel} amount={amount} />}
      {method === 'upi' && <UPIFlow stage={stage} onStart={startPayment} onCancel={onCancel} amount={amount} />}
      {method === 'online' && <OnlineFlow stage={stage} onStart={startPayment} onCancel={onCancel} amount={amount} />}
      {method === 'cash' && <CashFlow stage={stage} onStart={startPayment} onCancel={onCancel} amount={amount} />}
    </div>
  );
}

/* ─── Card (Physical POS) ─── */
function CardPOSFlow({ stage, onStart, onCancel, amount }: { stage: PaymentStage; onStart: () => void; onCancel: () => void; amount: number }) {
  return (
    <div className="text-center space-y-5 py-2">
      <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
        {/* POS machine body */}
        <div className="absolute inset-0 rounded-2xl bg-muted border-2 border-border" />
        {/* Animated card */}
        <div className={`relative z-10 ${stage === 'waiting' ? 'animate-card-tap' : stage === 'processing' ? 'animate-pulse' : ''}`}>
          <CreditCard className={`h-10 w-10 transition-colors duration-500 ${
            stage === 'processing' ? 'text-status-pending' : stage === 'waiting' ? 'text-primary' : 'text-muted-foreground'
          }`} />
        </div>
        {/* Contactless waves */}
        {stage === 'waiting' && (
          <div className="absolute top-1 right-1">
            <Wifi className="h-4 w-4 text-primary animate-pulse" />
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">
          {stage === 'idle' && 'Tap, Insert, or Swipe Card'}
          {stage === 'waiting' && 'Waiting for Card...'}
          {stage === 'processing' && 'Processing Payment...'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {stage === 'idle' && 'Initiate payment on the POS terminal'}
          {stage === 'waiting' && 'Present card on the POS machine'}
          {stage === 'processing' && 'Verifying with bank — do not remove card'}
        </p>
      </div>

      <StageIndicator stage={stage} labels={['Waiting for Card', 'Processing', 'Payment Successful']} />
      <AmountDisplay amount={amount} />
      <FlowActions stage={stage} onStart={onStart} onCancel={onCancel} startLabel="Initiate POS Payment" />
    </div>
  );
}

/* ─── UPI (QR Code) ─── */
function UPIFlow({ stage, onStart, onCancel, amount }: { stage: PaymentStage; onStart: () => void; onCancel: () => void; amount: number }) {
  return (
    <div className="text-center space-y-5 py-2">
      <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
        {/* QR placeholder */}
        <div className={`w-24 h-24 rounded-xl bg-foreground/5 border-2 border-border flex items-center justify-center ${stage === 'waiting' ? 'animate-qr-pulse' : ''}`}>
          <QrCode className={`h-14 w-14 transition-colors duration-500 ${
            stage !== 'idle' ? 'text-primary' : 'text-muted-foreground'
          }`} />
        </div>
        {/* Scanning ring */}
        {stage === 'waiting' && (
          <div className="absolute inset-0 rounded-xl border-2 border-primary/50 animate-scan-ring" />
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">
          {stage === 'idle' && 'UPI QR Code Payment'}
          {stage === 'waiting' && 'Scan QR Code to Pay'}
          {stage === 'processing' && 'Confirming Payment...'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {stage === 'idle' && 'Generate a dynamic QR for the customer'}
          {stage === 'waiting' && 'Customer should scan with any UPI app'}
          {stage === 'processing' && 'Waiting for UPI confirmation'}
        </p>
      </div>

      <StageIndicator stage={stage} labels={['Waiting for Payment', 'Confirming', 'Success']} />
      <AmountDisplay amount={amount} />
      <FlowActions stage={stage} onStart={onStart} onCancel={onCancel} startLabel="Generate QR Code" />
    </div>
  );
}

/* ─── Online Payment ─── */
function OnlineFlow({ stage, onStart, onCancel, amount }: { stage: PaymentStage; onStart: () => void; onCancel: () => void; amount: number }) {
  return (
    <div className="text-center space-y-5 py-2">
      <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
        <div className={`${stage === 'processing' ? 'animate-spin-slow' : ''}`}>
          <Globe className={`h-12 w-12 transition-colors duration-500 ${
            stage === 'processing' ? 'text-primary' : stage === 'waiting' ? 'text-status-pending' : 'text-muted-foreground'
          }`} />
        </div>
        {stage === 'processing' && (
          <div className="absolute -bottom-1 -right-1">
            <ShieldCheck className="h-5 w-5 text-status-ready animate-pulse" />
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">
          {stage === 'idle' && 'Online Payment Gateway'}
          {stage === 'waiting' && 'Processing...'}
          {stage === 'processing' && 'Verifying Payment...'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {stage === 'idle' && 'Process through payment gateway'}
          {stage === 'waiting' && 'Connecting to payment gateway'}
          {stage === 'processing' && 'Securing and verifying transaction'}
        </p>
      </div>

      <StageIndicator stage={stage} labels={['Processing', 'Verifying', 'Completed']} />
      <AmountDisplay amount={amount} />
      <FlowActions stage={stage} onStart={onStart} onCancel={onCancel} startLabel="Process Payment" />
    </div>
  );
}

/* ─── Cash ─── */
function CashFlow({ stage, onStart, onCancel, amount }: { stage: PaymentStage; onStart: () => void; onCancel: () => void; amount: number }) {
  return (
    <div className="text-center space-y-5 py-2">
      <div className="mx-auto w-24 h-24 flex items-center justify-center">
        <DollarSign className={`h-12 w-12 transition-colors duration-500 ${
          stage !== 'idle' ? 'text-status-ready' : 'text-muted-foreground'
        } ${stage === 'processing' ? 'animate-bounce' : ''}`} />
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">
          {stage === 'idle' && 'Cash Payment'}
          {stage === 'waiting' && 'Collecting Cash...'}
          {stage === 'processing' && 'Counting & Confirming...'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {stage === 'idle' && 'Collect cash from customer'}
          {stage === 'waiting' && 'Verify the amount received'}
          {stage === 'processing' && 'Preparing change if needed'}
        </p>
      </div>

      <AmountDisplay amount={amount} />
      <FlowActions stage={stage} onStart={onStart} onCancel={onCancel} startLabel="Confirm Cash Received" />
    </div>
  );
}

/* ─── Shared Sub-Components ─── */

function StageIndicator({ stage, labels }: { stage: PaymentStage; labels: [string, string, string] }) {
  const stageIndex = stage === 'idle' ? -1 : stage === 'waiting' ? 0 : stage === 'processing' ? 1 : 2;
  return (
    <div className="flex items-center justify-center gap-1">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-1">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium transition-all duration-500 ${
            i < stageIndex ? 'bg-status-ready/15 text-status-ready'
            : i === stageIndex ? 'bg-primary/15 text-primary animate-pulse'
            : 'bg-muted text-muted-foreground'
          }`}>
            {i < stageIndex ? <Check className="h-2.5 w-2.5" /> : null}
            {label}
          </div>
          {i < labels.length - 1 && <div className={`w-3 h-px transition-colors duration-500 ${i < stageIndex ? 'bg-status-ready' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  );
}

function AmountDisplay({ amount }: { amount: number }) {
  return (
    <div className="bg-muted/50 rounded-xl px-4 py-2.5 inline-block">
      <span className="text-xs text-muted-foreground">Amount: </span>
      <span className="font-mono font-bold text-foreground">${amount.toFixed(2)}</span>
    </div>
  );
}

function FlowActions({ stage, onStart, onCancel, startLabel }: { stage: PaymentStage; onStart: () => void; onCancel: () => void; startLabel: string }) {
  if (stage !== 'idle') {
    return (
      <button onClick={onCancel} disabled={stage === 'processing'} className="text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40">
        Cancel
      </button>
    );
  }
  return (
    <div className="flex gap-2">
      <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
        Back
      </button>
      <button onClick={onStart} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors btn-press">
        {startLabel}
      </button>
    </div>
  );
}

function SuccessScreen({ amount, method }: { amount: number; method: PaymentMethod }) {
  const methodLabel = { cash: 'Cash', card: 'Card (POS)', upi: 'UPI', online: 'Online' }[method];
  return (
    <div className="text-center space-y-4 py-6 animate-scale-in">
      <div className="mx-auto w-16 h-16 rounded-full bg-status-ready/15 flex items-center justify-center">
        <Check className="h-8 w-8 text-status-ready animate-success-pop" />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground">Payment Successful!</p>
        <p className="text-sm text-muted-foreground mt-1">{methodLabel} • ${amount.toFixed(2)}</p>
      </div>
      <p className="text-xs text-muted-foreground">Generating receipt…</p>
    </div>
  );
}
