export async function GET() {
  try {
    const res = await fetch(
      "https://online-appointment-backend-ottobright-8eer.onrender.com/getAllAppointments",
      { cache: "no-store" }
    );

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch appointments" }),
        { status: 500 }
      );
    }

    const data = await res.json();

    // Ensure we always return an array
    const appointments = Array.isArray(data.appointments)
      ? data.appointments
      : Array.isArray(data)
      ? data
      : [];

    return new Response(JSON.stringify({ appointments }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
