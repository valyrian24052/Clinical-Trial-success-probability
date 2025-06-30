// The exported code uses Tailwind CSS.
// Make sure to have Tailwind CSS set up in your development environment.
// For this preview, Tailwind is loaded via a script tag.
import React, { useState, useEffect } from "react";

// --- Mock UI Components (in lieu of shadcn/ui) ---

// A basic Button component
const Button = ({ children, className, variant, size, ...props }) => (
  <button
    className={`bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// A basic Checkbox component
const Checkbox = ({ checked, onCheckedChange, id, className }) => (
    <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onCheckedChange}
        className={`form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 ${className}`}
    />
);


// A basic Input component
const Input = ({ className, ...props }) => (
  <input
    className={`border border-gray-700 bg-gray-900 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${className}`}
    {...props}
  />
);

// A basic Label component
const Label = ({ children, ...props }) => (
  <label className="text-gray-300 font-medium" {...props}>
    {children}
  </label>
);

// Card related components
const Card = ({ children, className, ...props }) => (
  <div className={`rounded-lg shadow-md ${className}`} {...props}>
    {children}
  </div>
);
const CardHeader = ({ children }) => <div className="p-4">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-lg font-bold ${className}`}>{children}</h3>;
const CardDescription = ({ children, className }) => <p className={`text-sm text-gray-400 ${className}`}>{children}</p>;
const CardContent = ({ children }) => <div className="p-4 pt-0">{children}</div>;
const CardFooter = ({ children }) => <div className="p-4 pt-0">{children}</div>;


// A basic Badge component
const Badge = ({ children, className, variant, ...props }) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
             variant === 'outline' ? 'border border-gray-600 text-gray-200 bg-gray-800' : 'bg-blue-600 text-white'
        } ${className}`}
        {...props}
    >
        {children}
    </span>
);


// Collapsible components
const Collapsible = ({ children }) => <div>{children}</div>;
const CollapsibleTrigger = ({ children, asChild, ...props }) => <div {...props}>{children}</div>;
const CollapsibleContent = ({ children }) => <div>{children}</div>;

// Separator component
const Separator = ({className}) => <hr className={`border-gray-700 ${className}`} />;

// Slider component
const Slider = ({ value, onValueChange, max, step }) => {
    const handleChange = (event) => {
        onValueChange([value[0], parseInt(event.target.value, 10)]);
    };

    const handleLeftChange = (event) => {
        onValueChange([parseInt(event.target.value, 10), value[1]]);
    }

    return (
        <div className="relative w-full h-2">
             <input
                type="range"
                min="0"
                max={max}
                step={step}
                value={value[0]}
                onChange={handleLeftChange}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
                style={{ zIndex: value[0] > max - 100 ? 5: 3 }}
            />
            <input
                type="range"
                min="0"
                max={max}
                step={step}
                value={value[1]}
                onChange={handleChange}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
                style={{ zIndex: 4 }}
            />
        </div>
    );
};


// --- Main App Component ---

interface CreditCard {
  id: number;
  bank: string;
  name: string;
  category: string[];
  annualFee: number;
  incomeRequirement: number;
  benefits: string[];
  imagePrompt: string;
  selected: boolean;
}

const App = () => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<CreditCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<CreditCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [feeRange, setFeeRange] = useState([0, 20000]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIncomeRange, setSelectedIncomeRange] = useState<string>("All");

  const banks = [
    "HDFC Bank",
    "ICICI Bank",
    "SBI Card",
    "Axis Bank",
    "Kotak Mahindra",
    "Yes Bank",
    "American Express",
    "IDFC FIRST Bank",
  ];

  const categories = [
    "Travel",
    "Cashback",
    "Rewards",
    "Shopping",
    "No Annual Fee",
    "Fuel",
    "Luxury",
    "Dining",
    "Business",
    "Student",
    "UPI",
  ];

  const incomeRanges = [
    "All",
    "Under ₹3,00,000",
    "₹3,00,000 - ₹6,00,000",
    "₹6,00,000 - ₹12,00,000",
    "Over ₹12,00,000",
  ];

  useEffect(() => {
    // Load Font Awesome script dynamically
    const script = document.createElement("script");
    script.src = "https://kit.fontawesome.com/a076d05399.js";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    // Generate mock data
    const mockCards: CreditCard[] = [
        {
            id: 1,
            bank: "HDFC Bank",
            name: "Regalia First",
            category: ["Travel", "Rewards"],
            annualFee: 1000,
            incomeRequirement: 400000,
            benefits: ["Priority Pass for lounge access", "5x reward points on dining", "Fuel surcharge waiver"],
            imagePrompt: "Premium blue credit card with metallic finish",
            selected: false,
        },
        {
            id: 2,
            bank: "ICICI Bank",
            name: "Sapphiro",
            category: ["Rewards", "Dining", "Travel"],
            annualFee: 3500,
            incomeRequirement: 800000,
            benefits: ["4x reward points on dining", "BOGO on movie tickets", "Complimentary golf sessions"],
            imagePrompt: "Elegant gold metal credit card",
            selected: false,
        },
        {
            id: 3,
            bank: "SBI Card",
            name: "SimplySAVE",
            category: ["Cashback", "Rewards"],
            annualFee: 499,
            incomeRequirement: 300000,
            benefits: ["10x rewards on dining & movies", "1% cashback on all other spends", "Welcome gift vouchers"],
            imagePrompt: "Modern white credit card with blue accents",
            selected: false,
        },
        {
            id: 4,
            bank: "Amazon Pay",
            name: "ICICI Bank Card",
            category: ["Cashback", "Shopping", "No Annual Fee"],
            annualFee: 0,
            incomeRequirement: 250000,
            benefits: ["5% cashback on Amazon for Prime members", "2% on partner merchants", "No joining or annual fees"],
            imagePrompt: "Amazon branded credit card with a smile logo",
            selected: false,
        },
        {
            id: 5,
            bank: "Axis Bank",
            name: "Flipkart Card",
            category: ["Cashback", "Shopping"],
            annualFee: 500,
            incomeRequirement: 300000,
            benefits: ["5% cashback on Flipkart", "4% cashback on Swiggy, PVR, Uber", "Airport lounge access"],
            imagePrompt: "Flipkart branded blue and yellow credit card",
            selected: false,
        },
        {
            id: 6,
            bank: "SBI Card",
            name: "Cashback Card",
            category: ["Cashback"],
            annualFee: 999,
            incomeRequirement: 350000,
            benefits: ["5% cashback on all online spends", "1% cashback on offline spends", "No merchant restrictions for online cashback"],
            imagePrompt: "A vibrant green and blue gradient credit card",
            selected: false,
        },
        {
            id: 7,
            bank: "HDFC Bank",
            name: "Millennia",
            category: ["Cashback", "Shopping"],
            annualFee: 1000,
            incomeRequirement: 350000,
            benefits: ["5% cashback on Amazon, Flipkart, etc.", "1% cashback on all other spends", "8 domestic lounge visits per year"],
            imagePrompt: "A stylish millennial-focused credit card with pastel colors",
            selected: false,
        },
        {
            id: 8,
            bank: "Axis Bank",
            name: "ACE Card",
            category: ["Cashback", "UPI"],
            annualFee: 499,
            incomeRequirement: 300000,
            benefits: ["5% on bill pays, DTH via Google Pay", "4% on Swiggy, Zomato, Ola", "2% flat cashback on all other spends"],
            imagePrompt: "A minimal and clean white credit card",
            selected: false,
        },
        {
            id: 9,
            bank: "American Express",
            name: "Platinum Travel",
            category: ["Travel", "Rewards", "Luxury"],
            annualFee: 3500,
            incomeRequirement: 600000,
            benefits: ["Milestone rewards up to 40,000 points", "Complimentary domestic lounge visits", "Taj & Marriott vouchers on reaching milestones"],
            imagePrompt: "The iconic American Express platinum card design",
            selected: false,
        },
        {
            id: 10,
            bank: "HDFC Bank",
            name: "Infinia",
            category: ["Luxury", "Travel", "Rewards"],
            annualFee: 12500,
            incomeRequirement: 3000000,
            benefits: ["Unlimited airport lounge access worldwide", "Complimentary golf games", "Low 2% forex markup fee"],
            imagePrompt: "An exclusive, metallic black credit card",
            selected: false,
        },
        {
            id: 11,
            bank: "Axis Bank",
            name: "Atlas",
            category: ["Travel", "Rewards"],
            annualFee: 5000,
            incomeRequirement: 900000,
            benefits: ["Earn Edge Miles on spends", "Tier-based travel benefits", "Transfer miles to various airline/hotel partners"],
            imagePrompt: "A credit card with a world map or globe design",
            selected: false,
        },
        {
            id: 12,
            bank: "HDFC Bank",
            name: "Tata Neu Infinity",
            category: ["Shopping", "Rewards", "UPI"],
            annualFee: 1499,
            incomeRequirement: 120000,
            benefits: ["5% back as NeuCoins on Tata Neu", "1.5% back on other spends", "Domestic and International lounge access"],
            imagePrompt: "A card co-branded with the Tata Neu logo",
            selected: false,
        },
        {
            id: 13,
            bank: "IDFC FIRST Bank",
            name: "Millennia",
            category: ["Rewards", "No Annual Fee"],
            annualFee: 0,
            incomeRequirement: 300000,
            benefits: ["Up to 10x rewards that never expire", "Low interest rates", "Free for life"],
            imagePrompt: "A modern red and white themed credit card",
            selected: false,
        },
        {
            id: 14,
            bank: "American Express",
            name: "MRCC",
            category: ["Rewards"],
            annualFee: 1500,
            incomeRequirement: 500000,
            benefits: ["1000 bonus points on 4 transactions/month", "24K Gold Collection rewards", "Flexible points transfer partners"],
            imagePrompt: "Classic American Express card with gold detailing",
            selected: false,
        },
        {
            id: 15,
            bank: "HDFC Bank",
            name: "Diners Club Black",
            category: ["Luxury", "Travel", "Dining"],
            annualFee: 10000,
            incomeRequirement: 175000,
            benefits: ["10X rewards via SmartBuy", "Unlimited lounge access", "6 free golf games quarterly"],
            imagePrompt: "A premium, sleek black card for dining",
            selected: false,
        }
    ];
    setCards(mockCards);
    setFilteredCards(mockCards);
  }, []);

  useEffect(() => {
    let results = [...cards];

    // Apply search filter
    if (searchQuery) {
      results = results.filter(
        (card) =>
          card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.bank.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply bank filter
    if (selectedBanks.length > 0) {
      results = results.filter((card) => selectedBanks.includes(card.bank));
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter((card) =>
        card.category.some((cat) => selectedCategories.includes(cat))
      );
    }

    // Apply fee range filter
    results = results.filter(
      (card) => card.annualFee >= feeRange[0] && card.annualFee <= feeRange[1]
    );

    // Apply income filter
    if (selectedIncomeRange !== "All") {
      if (selectedIncomeRange === "Under ₹3,00,000") {
        results = results.filter((card) => card.incomeRequirement < 300000);
      } else if (selectedIncomeRange === "₹3,00,000 - ₹6,00,000") {
        results = results.filter(
          (card) =>
            card.incomeRequirement >= 300000 && card.incomeRequirement < 600000
        );
      } else if (selectedIncomeRange === "₹6,00,000 - ₹12,00,000") {
        results = results.filter(
          (card) =>
            card.incomeRequirement >= 600000 && card.incomeRequirement < 1200000
        );
      } else if (selectedIncomeRange === "Over ₹12,00,000") {
        results = results.filter((card) => card.incomeRequirement >= 1200000);
      }
    }

    setFilteredCards(results);
  }, [
    searchQuery,
    selectedBanks,
    selectedCategories,
    feeRange,
    selectedIncomeRange,
    cards,
  ]);

  const toggleCardSelection = (id: number) => {
    let selectedCount = cards.filter(c => c.selected).length;
    const isCurrentlySelected = cards.find(c => c.id === id)?.selected;
    
    if (selectedCount >= 3 && !isCurrentlySelected) {
        // Find the first selected card to deselect it
        const firstSelected = cards.find(c => c.selected);
        if(firstSelected){
            setCards(currentCards => currentCards.map(card => {
                if (card.id === id) return { ...card, selected: true };
                if (card.id === firstSelected.id) return { ...card, selected: false };
                return card;
            }));
        }
    } else {
         setCards(currentCards => currentCards.map(card =>
            card.id === id ? { ...card, selected: !card.selected } : card
        ));
    }
  };
  
  useEffect(() => {
    setSelectedCards(cards.filter(card => card.selected));
  }, [cards]);


  const clearFilters = () => {
    setSearchQuery("");
    setFeeRange([0, 20000]);
    setSelectedBanks([]);
    setSelectedCategories([]);
    setSelectedIncomeRange("All");
  };

  const toggleBank = (bank: string) => {
    setSelectedBanks((prev) =>
      prev.includes(bank) ? prev.filter((b) => b !== bank) : [...prev, bank]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };
  
  const handleIncomeChange = (range: string) => {
    setSelectedIncomeRange(currentRange => currentRange === range ? "All" : range);
  }
  
  const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>CreditWise Logo</title>
        <rect x="1" y="14" width="9" height="9" rx="2" fill="#F3EADA" transform="rotate(-15 5.5 18.5)" />
        <rect x="9" y="23" width="9" height="9" rx="2" fill="#F3EADA" />
        <rect x="19" y="23" width="9" height="9" rx="2" fill="#F3EADA" />
        <rect x="9" y="13" width="9" height="9" rx="2" fill="#F3EADA" />
        <rect x="19" y="13" width="9" height="9" rx="2" fill="#F3EADA" />
        <rect x="19" y="3" width="9" height="9" rx="2" fill="#F3EADA" />
        <path d="M23.5 0L20.5 3L26.5 3Z" fill="#4FB3A4" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans">
      {/* Header */}
      <header className="bg-black text-white py-4 px-6 shadow-md border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-2xl font-bold text-white">CreditWise</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="font-medium hover:text-blue-400 cursor-pointer">Home</a>
            <a href="#" className="font-medium hover:text-blue-400 cursor-pointer">Cards</a>
            <a href="#" className="font-medium hover:text-blue-400 cursor-pointer">Compare</a>
            <a href="#" className="font-medium hover:text-blue-400 cursor-pointer">About</a>
          </nav>
          <div className="flex items-center">
            <button className="text-white cursor-pointer">
              <i className="fas fa-user-circle text-2xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-black border-b border-gray-800">
        <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center">
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Perfect Credit Card
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Compare features, rewards, and benefits to discover the ideal card
              for your lifestyle and financial goals.
            </p>
            <div className="bg-black border border-gray-800 p-2 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for cards by name or bank..."
                  className="pl-10 pr-4 py-3 w-full bg-gray-900 border-gray-700 text-gray-200 placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {categories.slice(0, 7).map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm rounded-full transition-colors duration-200 ${
                    selectedCategories.includes(category)
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      : "bg-gray-800 text-gray-100 hover:bg-gray-700 border-gray-600"
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Panel */}
          <aside className="md:w-1/4 lg:w-1/5">
            <div className="bg-black border border-gray-800 rounded-lg p-4 sticky top-28">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm bg-transparent text-gray-400 hover:bg-gray-700 hover:text-white whitespace-nowrap">
                  Clear All
                </Button>
              </div>
              
              <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <CollapsibleTrigger asChild>
                  <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <h3 className="font-semibold text-white">Banks</h3>
                    <i className={`fas fa-chevron-${isFilterOpen ? "up" : "down"} text-sm text-gray-400`}></i>
                  </div>
                </CollapsibleTrigger>
                {isFilterOpen && (
                <CollapsibleContent>
                  <div className="space-y-2 mb-6">
                    {banks.map((bank) => (
                      <div key={bank} className="flex items-center">
                        <Checkbox id={`bank-${bank}`} checked={selectedBanks.includes(bank)} onCheckedChange={() => toggleBank(bank)} />
                        <Label htmlFor={`bank-${bank}`} className="ml-2 cursor-pointer text-gray-300">
                          {bank}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
                )}
              </Collapsible>
              
              <Separator className="my-4" />
              
              <div className="mb-6">
                 <h3 className="font-semibold text-white mb-4">Card Categories</h3>
                 <div className="space-y-2">
                   {categories.map((category) => (
                     <div key={category} className="flex items-center">
                       <Checkbox id={`category-${category}`} checked={selectedCategories.includes(category)} onCheckedChange={() => toggleCategory(category)} />
                       <Label htmlFor={`category-${category}`} className="ml-2 cursor-pointer text-gray-300">
                         {category}
                       </Label>
                     </div>
                   ))}
                 </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-4">Annual Fee Range</h3>
                 <div className="px-2">
                    <Slider
                        max={20000}
                        step={500}
                        value={feeRange}
                        onValueChange={setFeeRange}
                        className="my-6"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>₹{feeRange[0]}</span>
                        <span>₹{feeRange[1]}</span>
                    </div>
                 </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="font-semibold text-white mb-4">Income Requirements</h3>
                <div className="space-y-2">
                  {incomeRanges.map((range) => (
                    <div key={range} className="flex items-center">
                       <Checkbox id={`income-${range}`} checked={selectedIncomeRange === range} onCheckedChange={() => handleIncomeChange(range)} />
                      <Label htmlFor={`income-${range}`} className="ml-2 cursor-pointer text-gray-300">{range}</Label>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Card Grid */}
          <div className="md:w-3/4 lg:w-4/5">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Available Cards ({filteredCards.length})
              </h2>
              <div className="text-sm text-gray-400">
                {selectedCards.length > 0 && (
                  <span>
                    {selectedCards.length} card{selectedCards.length > 1 ? "s" : ""} selected
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <Card key={card.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 bg-gray-900 border border-gray-700 flex flex-col">
                  <div className={`relative h-40 overflow-hidden flex items-center justify-center border-b border-gray-800`}>
                    <div className="absolute inset-0 opacity-10">
                       <img
                            src={`https://placehold.co/400x300/1a1a1a/FFFFFF?text=${encodeURIComponent(card.imagePrompt)}`}
                            alt={card.name}
                            className="w-full h-full object-cover"
                       />
                    </div>
                    <div className="relative z-10 flex items-center space-x-3 text-center">
                      <span className="text-2xl font-bold text-white px-2">
                        {card.bank}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 z-20">
                    <Checkbox checked={card.selected} onCheckedChange={() => toggleCardSelection(card.id)} className="h-5 w-5 bg-white border-gray-300 rounded-sm"/>
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">{card.name}</CardTitle>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {card.category.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-2 mb-4">
                          {card.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start">
                              <i className="fas fa-check-circle text-green-400 mt-1 mr-2 text-xs"></i>
                              <p className="text-sm text-gray-300">{benefit}</p>
                            </div>
                          ))}
                        </div>
                         <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
                            <div>
                                <span className="text-xs text-gray-400">Annual Fee</span>
                                <p className="font-semibold text-white">
                                    {card.annualFee === 0 ? "Zero Fee" : `₹${card.annualFee.toLocaleString("en-IN")}`}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">Min. Income (p.a.)</span>
                                <p className="font-semibold text-white">
                                    ₹{(card.incomeRequirement / 100000).toFixed(1)}L
                                </p>
                            </div>
                         </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-blue-600 hover:border-blue-600">
                          <i className="fas fa-info-circle mr-2"></i>
                          Learn More
                        </Button>
                      </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
            {filteredCards.length === 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                <i className="fas fa-search text-4xl text-gray-600 mb-4"></i>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">
                  No cards found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search criteria.
                </p>
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Compare Floating Button */}
      {selectedCards.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button className="px-6 py-4 shadow-lg !rounded-full" size="lg">
            Compare {selectedCards.length} Card{selectedCards.length > 1 ? "s" : ""}{" "}
            <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <Logo />
                 <h3 className="text-xl font-bold">CreditWise</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Your one-stop destination for comparing credit cards and making wise financial decisions.
              </p>
              <div className="flex space-x-4">
                 <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
                 <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                 <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
                 <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
             <div>
                 <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
                 <ul className="space-y-2">
                     <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                     <li><a href="#" className="text-gray-400 hover:text-white">Cards</a></li>
                     <li><a href="#" className="text-gray-400 hover:text-white">Compare</a></li>
                     <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                 </ul>
             </div>
             <div>
                 <h4 className="font-semibold mb-4 text-white">Card Categories</h4>
                 <ul className="space-y-2">
                     {categories.slice(0, 5).map(cat => (
                        <li key={cat}><a href="#" className="text-gray-400 hover:text-white">{cat}</a></li>
                     ))}
                 </ul>
             </div>
             <div>
                <h4 className="font-semibold mb-4 text-white">Newsletter</h4>
                <p className="text-gray-400 mb-4">Subscribe for the latest offers.</p>
                <div className="flex">
                    <Input type="email" placeholder="your.email@example.com" className="bg-gray-800 border-gray-700 rounded-r-none"/>
                    <Button className="rounded-l-none">Subscribe</Button>
                </div>
             </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-gray-500 text-sm">
             <p>© 2025 CreditWise. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
