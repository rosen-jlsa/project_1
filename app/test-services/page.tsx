import { getServices, createBooking } from "@/app/actions";

export default async function TestServicesPage() {
    const services = await getServices();

    // Test Booking Submission (Mock)
    const mockFormData = new FormData();
    mockFormData.append("serviceId", "1");
    mockFormData.append("date", "2024-01-01");
    mockFormData.append("time", "10:00");
    mockFormData.append("firstName", "Test");
    mockFormData.append("lastName", "User");
    mockFormData.append("email", "test@example.com");
    mockFormData.append("phone", "1234567890");

    const bookingResult = await createBooking(null, mockFormData);

    // Test Invalid Submission
    const invalidFormData = new FormData(); // Missing fields
    const invalidResult = await createBooking(null, invalidFormData);

    // Test Assertions
    const checks = [
        { name: "Services returned", passed: services.length > 0, details: `Count: ${services.length}` },
        { name: "Has 9 mock services", passed: services.length === 9, details: `Expected 9, got ${services.length}` },
        { name: "Service has Price", passed: services[0]?.price !== undefined, details: `Price: ${services[0]?.price}` },
        { name: "Service has Duration", passed: services[0]?.duration !== undefined, details: `Duration: ${services[0]?.duration}` },
        { name: "Service has Category", passed: services[0]?.category !== undefined, details: `Category: ${services[0]?.category}` },
        { name: "Booking Submission (Valid)", passed: bookingResult.success, details: bookingResult.message },
        { name: "Booking Submission (Invalid)", passed: !invalidResult.success, details: "Correctly rejected missing fields" },
    ];

    const allPassed = checks.every(c => c.passed);

    return (
        <div className="p-10 font-mono">
            <h1 className="text-2xl font-bold mb-6">System Verification: Service Menu</h1>

            <div className={`p-4 rounded-lg mb-8 ${allPassed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                <h2 className="text-xl font-bold">{allPassed ? "ALL SYSTEMS OPERATIONAL" : "SYSTEM FAILURE DETECTED"}</h2>
            </div>

            <div className="space-y-4">
                {checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded bg-white">
                        <div className={`w-20 font-bold ${check.passed ? "text-green-600" : "text-red-600"}`}>
                            {check.passed ? "[PASS]" : "[FAIL]"}
                        </div>
                        <div className="flex-1 font-bold">{check.name}</div>
                        <div className="text-sm text-gray-500">{check.details}</div>
                    </div>
                ))}
            </div>

            <div className="mt-10">
                <h3 className="font-bold mb-2">Raw Data Dump (First 3 items):</h3>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                    {JSON.stringify(services.slice(0, 3), null, 2)}
                </pre>
            </div>
        </div>
    );
}
