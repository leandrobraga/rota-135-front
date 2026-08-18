import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Car, User } from "lucide-react";
import { useState } from "react";
import { RefreshProgressBar } from "#/components/RefreshProgressBar";
import { useTripScheduleByIdQuery } from "#/features/trip-schedules/queries/use-trip-schedule-by-id-query";
import { CancelTripDialog } from "#/features/trips/components/CancelTripDialog";
import { PaymentStatusBadge } from "#/features/trips/components/PaymentStatusBadge";
import { TripBookingTypeBadge } from "#/features/trips/components/TripBookingTypeBadge";
import { TripCheckpointTimeline } from "#/features/trips/components/TripCheckpointTimeline";
import { TripRefundInfo } from "#/features/trips/components/TripRefundInfo";
import { TripStatusBadge } from "#/features/trips/components/TripStatusBadge";
import {
  isLiveTripStatus,
  useTripByIdQuery,
} from "#/features/trips/queries/use-trip-by-id-query";
import { formatCurrencyDisplay } from "#/lib/formatters";

const NON_CANCELLABLE_STATUSES = ["COMPLETED", "CANCELLED"];

function formatScheduledAt(scheduledAt: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(scheduledAt));
}

export function TripDetailPage({ tripId }: { tripId: string }) {
  const navigate = useNavigate();
  const { data: trip, isLoading, dataUpdatedAt } = useTripByIdQuery(tripId);
  const { data: tripSchedule } = useTripScheduleByIdQuery(
    trip?.tripScheduleId ?? "",
  );
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  if (isLoading || !trip) {
    return (
      <p className="py-8 text-center text-[13.5px] text-neutral-600">
        Carregando...
      </p>
    );
  }

  const live = isLiveTripStatus(trip.status);
  const canCancel = !NON_CANCELLABLE_STATUSES.includes(trip.status);

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate({ to: "/trips" })}
        className="flex items-center gap-1.5 text-[13.5px] font-medium text-neutral-600 hover:text-navy-800"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display font-bold text-[22px] text-navy-800">
            {trip.client.name}
          </h1>
          <div className="flex items-center gap-1.5">
            <TripStatusBadge status={trip.status} />
            <TripBookingTypeBadge bookingType={trip.bookingType} />
            <PaymentStatusBadge payment={trip.payment} />
          </div>
        </div>
        <RefreshProgressBar live={live} dataUpdatedAt={dataUpdatedAt} />
      </div>

      <div className="rounded-xl border border-neutral-300 p-4">
        <dl className="flex flex-col gap-3">
          <div>
            <dt className="text-[12px] font-bold tracking-[0.3px] text-neutral-600">
              EMBARQUE
            </dt>
            <dd className="text-[14.5px] text-navy-800">
              {trip.pickupAddress}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-bold tracking-[0.3px] text-neutral-600">
              DESEMBARQUE
            </dt>
            <dd className="text-[14.5px] text-navy-800">
              {trip.dropoffAddress}
            </dd>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <dt className="text-[12px] font-bold tracking-[0.3px] text-neutral-600">
                AGENDAMENTO
              </dt>
              <dd className="text-[14.5px] text-navy-800">
                {formatScheduledAt(trip.scheduledAt)}
              </dd>
            </div>
            <div>
              <dt className="text-[12px] font-bold tracking-[0.3px] text-neutral-600">
                PREÇO
              </dt>
              <dd className="text-[14.5px] text-navy-800">
                {formatCurrencyDisplay(trip.price)}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-neutral-300 p-4">
        <h2 className="mb-3 text-[12px] font-bold tracking-[0.3px] text-neutral-600">
          MOTORISTA E VEÍCULO
        </h2>
        {trip.driver && tripSchedule ? (
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-neutral-500" />
              <span className="text-[14.5px] text-navy-800">
                {trip.driver.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Car size={16} className="text-neutral-500" />
              <span className="text-[14.5px] text-navy-800">
                {tripSchedule.vehicle.brand} {tripSchedule.vehicle.model}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-[13.5px] text-neutral-600">
            Aguardando atribuição
          </p>
        )}
      </div>

      <div className="rounded-xl border border-neutral-300 p-4">
        <h2 className="mb-3 text-[12px] font-bold tracking-[0.3px] text-neutral-600">
          CHECKPOINTS
        </h2>
        <TripCheckpointTimeline checkpoint={trip.checkpoint} />
      </div>

      <TripRefundInfo refund={trip.refund} />

      {canCancel && (
        <button
          type="button"
          onClick={() => setConfirmingCancel(true)}
          className="h-[46px] self-start rounded-[10px] bg-[#9C4A3E] px-5 font-bold text-[14.5px] text-white"
        >
          Cancelar corrida
        </button>
      )}

      <CancelTripDialog
        trip={trip}
        open={confirmingCancel}
        onOpenChange={setConfirmingCancel}
      />
    </div>
  );
}
