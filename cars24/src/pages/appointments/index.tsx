import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Car, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAppointmentByUser } from "@/lib/appointmentapi";

const AppointmentsPage = () => {
  // keeping this here for reference if we need dummy data
  // const appointments = [
  //   {
  //     id: '1',
  //     car: {
  //       id: 'car1',
  //       title: 'Honda City 2020 ZX MT PETROL',
  //       image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  //     },
  //     scheduledDate: '2024-03-15',
  //     scheduledTime: '10:00 AM',
  //     location: 'Sector 18, Noida',
  //     appointmentType: 'branch_visit',
  //     status: 'upcoming',
  //     notes: 'Please bring all required documents for inspection'
  //   }
  // ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getAppointmentTypeLabel = (type: string) => {
    return type === "home_inspection" ? "Home Inspection" : "Branch Visit";
  };
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any>(null);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user) {
          console.log('Fetching appointments for user:', user?.id);
          const data = await getAppointmentByUser(user?.id);
          console.log('Appointments API response:', data);
          console.log('Data type:', typeof data);
          console.log('Is Array:', Array.isArray(data));

          // Handle different response formats
          let appointmentsData = data;
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            // If response is an object, check if it has a data property
            if (data.data && Array.isArray(data.data)) {
              appointmentsData = data.data;
              console.log('Found appointments in data.data:', appointmentsData);
            } else if (data.appointments && Array.isArray(data.appointments)) {
              appointmentsData = data.appointments;
              console.log('Found appointments in data.appointments:', appointmentsData);
            } else {
              console.log('Response is object but no array found:', Object.keys(data));
            }
          }

          setAppointments(appointmentsData);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments().then();
  }, [user]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600">
        <div className="min-h-screen bg-gray-50 text-black">
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                My Appointments
              </h1>
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No appointments found. Book one now!</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            My Appointments
          </h1>

          <div className="space-y-4">
            {appointments?.map((appointment:any) => {
              console.log('Rendering appointment:', appointment);
              console.log('Appointment structure:', {
                hasAppointmentKey: !!appointment.appointment,
                hasCarKey: !!appointment.car,
                carValue: appointment.car,
                appointmentKeys: Object.keys(appointment)
              });
              return (
              <div
                key={appointment.appointment?.id || Math.random()}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div
                  className={`px-4 py-2 ${getStatusBadgeColor(
                    appointment.appointment.status
                  )}`}
                >
                  <span className="text-white text-sm font-medium capitalize">
                    {appointment.appointment.status}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Car className="w-5 h-5 mr-2 text-gray-500" />
                        {appointment?.car?.title || 'Car (Details Not Available)'}
                      </h3>

                      <div className="mt-4 space-y-2">
                        <p className="text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Date:{" "}
                          {
                            new Date(appointment.appointment.scheduledDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Time: {appointment.appointment.scheduledTime}
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Location: {appointment.appointment.location}
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Type:{" "}
                          {getAppointmentTypeLabel(appointment.appointment.appointmentType)}
                        </p>
                      </div>

                      {appointment.appointment.notes && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-700">
                            {appointment.appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {appointment.appointment.status === "upcoming" && (
                      <button
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to cancel this appointment?"
                            )
                          ) {
                            // Handle cancellation
                            console.log(
                              "Cancelling appointment:",
                              appointment.appointment.id
                            );
                          }
                        }}
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>

                  {appointment.appointment.status === "upcoming" && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-md">
                      <p className="text-sm text-blue-800 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Please keep your car's documents ready for inspection
                      </p>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>

          {appointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No Appointments
              </h3>
              <p className="text-gray-600 mt-2">
                You don't have any appointments scheduled
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppointmentsPage;