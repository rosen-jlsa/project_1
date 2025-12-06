import { getServices } from "@/app/actions";
import { Scissors, Sparkles, User, Clock } from "lucide-react";

export async function Services() {
    const services = await getServices();

    // Group services by category
    const categories = Array.from(new Set(services?.map(s => s.category) || []));

    return (
        <section id="services" className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Our Services</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Experience world-class hair care and styling services tailored to your unique style.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map(category => {
                        const categoryServices = services?.filter(s => s.category === category);
                        return (
                            <div key={category} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        {category === 'Men' && <Scissors className="w-6 h-6" />}
                                        {category === 'Women' && <Sparkles className="w-6 h-6" />}
                                        {category === 'Children' && <User className="w-6 h-6" />}
                                        {category === 'Piercing' && <div className="w-6 h-6 rounded-full border-2 border-current" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-primary">{category}</h3>
                                </div>

                                <ul className="space-y-4">
                                    {categoryServices?.map(service => (
                                        <li key={service.id} className="flex justify-between items-start border-b border-gray-50 pb-2 last:border-0">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{service.name}</h4>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {service.duration} min
                                                </div>
                                            </div>
                                            <span className="font-bold text-primary">${service.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
