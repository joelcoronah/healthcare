"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { getAppointmentSchema } from "../../lib/validation";
import { useRouter } from "next/navigation";
import { Doctors } from "../../constants";
import Image from "next/image";
import { createAppointment } from "../../lib/actions/appointment.actions";
import { SelectItem } from "../ui/select";

export enum FieldTypes {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const AppointmentForm = ({
  userId,
  patientId,
  type,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });

  const buttonLabel = () => {
    switch (type) {
      case "create":
        return "Create Appointment";
      case "cancel":
        return "Cancel Appointment";
      case "schedule":
        return "Schedule Appointment";
      default:
        return "Create Appointment";
    }
  };

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
        break;
    }
    try {
      console.log({ values });
      console.log({ type });
      console.log({ patientId });
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);

        console.log({ appointment });
        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">
            Request a new appointment in 10 seconds
          </p>
        </section>

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FieldTypes.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeHolder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FieldTypes.DATE_PICKER}
              name="schedule"
              label="Expected appointment date"
              control={form.control}
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FieldTypes.TEXTAREA}
                name="reason"
                label="Reason for appointment"
                placeHolder="Enter reason for the appointment"
                control={form.control}
              />

              <CustomFormField
                fieldType={FieldTypes.TEXTAREA}
                name="notes"
                label="Notes"
                placeHolder="Enter notes"
                control={form.control}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FieldTypes.TEXTAREA}
            name="cancellationReason"
            label="Reason for cancellation"
            placeHolder="Enter reason for cancellation"
            control={form.control}
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full select-none`}
        >
          {buttonLabel()}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
