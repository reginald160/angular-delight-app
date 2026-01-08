import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Home, 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Search,
  Filter,
  Calendar,
  Phone,
  PoundSterling
} from 'lucide-react';

const savedProperties = [
  {
    id: 1,
    title: '2 Bedroom Flat in Kensington',
    price: 2500,
    location: 'Kensington, London',
    bedrooms: 2,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    status: 'available',
  },
  {
    id: 2,
    title: 'Modern Studio in Manchester',
    price: 950,
    location: 'Manchester City Centre',
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    status: 'viewing_scheduled',
  },
  {
    id: 3,
    title: '3 Bedroom House in Birmingham',
    price: 1800,
    location: 'Edgbaston, Birmingham',
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    status: 'available',
  },
];

const upcomingViewings = [
  { property: 'Modern Studio in Manchester', date: 'Tomorrow, 2:00 PM', agent: 'John Smith' },
  { property: '2 Bedroom Flat in Kensington', date: 'Friday, 10:00 AM', agent: 'Sarah Johnson' },
];

const rentalGuides = [
  { title: 'Renting in the UK Guide', description: 'Everything you need to know' },
  { title: 'Tenant Rights', description: 'Know your legal protections' },
  { title: 'Deposit Protection', description: 'How schemes work' },
  { title: 'Moving Checklist', description: 'Essential preparation steps' },
];

export default function HousingDashboard() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Housing 🏠
        </h1>
        <p className="text-muted-foreground">
          Find your perfect home in the United Kingdom
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search by city, area, or postcode..." className="pl-10" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button variant="royal">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Saved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Viewed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Viewings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Enquiries</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Saved Properties */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold">Saved Properties</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {savedProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </Button>
                  {property.status === 'viewing_scheduled' && (
                    <Badge className="absolute bottom-2 left-2 bg-green-600">
                      Viewing Scheduled
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" /> {property.bathrooms}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-foreground">
                      <PoundSterling className="w-4 h-4" />
                      {property.price.toLocaleString()}/mo
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Viewings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Viewings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingViewings.map((viewing, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm text-foreground mb-1">
                    {viewing.property}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {viewing.date}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Agent: {viewing.agent}
                  </p>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Manage Viewings
              </Button>
            </CardContent>
          </Card>

          {/* Rental Guides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rental Guides</CardTitle>
              <CardDescription>Essential resources for renters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {rentalGuides.map((guide) => (
                <Button 
                  key={guide.title}
                  variant="ghost" 
                  className="w-full justify-start h-auto py-3"
                >
                  <div className="text-left">
                    <p className="font-medium text-sm">{guide.title}</p>
                    <p className="text-xs text-muted-foreground">{guide.description}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
