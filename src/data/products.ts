export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  category: 'design' | 'development' | 'business' | 'marketing';
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  variants?: {
    name: string;
    options: string[];
  }[];
  features: string[];
  details: {
    format: string;
    pages?: number;
    author: string;
    publishedDate: string;
  };
  tags: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Design Systems Mastery',
    description: 'The complete guide to building scalable design systems',
    longDescription:
      'Learn how to architect, build, and maintain design systems that scale across organizations. This comprehensive guide covers everything from design tokens to component libraries.',
    price: 49.99,
    originalPrice: 79.99,
    category: 'design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80',
    ],
    rating: 4.8,
    reviews: 342,
    inStock: true,
    features: [
      'Complete design token framework',
      'Component architecture patterns',
      'Documentation best practices',
      'Team collaboration strategies',
      'Scalability case studies',
    ],
    details: {
      format: 'PDF + Interactive Web Version',
      pages: 320,
      author: 'Sarah Chen',
      publishedDate: '2024',
    },
    tags: ['design', 'systems', 'components', 'ux'],
  },
  {
    id: '2',
    name: 'React Performance Optimization',
    description: 'Advanced techniques to build lightning-fast React applications',
    longDescription:
      'Master advanced performance optimization techniques in React. Learn about memoization, code splitting, lazy loading, and more to build applications that stay fast at scale.',
    price: 59.99,
    originalPrice: 89.99,
    category: 'development',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    ],
    rating: 4.9,
    reviews: 589,
    inStock: true,
    features: [
      'React profiling tools',
      'Bundle optimization',
      'Memory leak detection',
      'Real-world case studies',
      'Performance metrics',
    ],
    details: {
      format: 'Video Lectures + PDF + Code Examples',
      author: 'Alex Kumar',
      publishedDate: '2024',
    },
    tags: ['react', 'performance', 'optimization', 'javascript'],
  },
  {
    id: '3',
    name: 'Web3 & Blockchain Fundamentals',
    description: 'Everything you need to know about blockchain and web3 development',
    longDescription:
      'A comprehensive introduction to blockchain technology, smart contracts, and Web3 development. Perfect for developers looking to enter the blockchain space.',
    price: 69.99,
    category: 'development',
    image: 'https://images.unsplash.com/photo-1640161174505-f61a14368900?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1640161174505-f61a14368900?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1640161174505-f61a14368900?auto=format&fit=crop&w=600&q=80',
    ],
    rating: 4.7,
    reviews: 421,
    inStock: true,
    features: [
      'Blockchain architecture',
      'Smart contract development',
      'Solidity programming',
      'DeFi protocols',
      'NFT creation',
    ],
    details: {
      format: 'Video Lectures + Code Repository',
      author: 'Marcus Johnson',
      publishedDate: '2024',
    },
    tags: ['blockchain', 'web3', 'solidity', 'crypto'],
  },
  {
    id: '4',
    name: 'Personal Brand Building for Creators',
    description: 'Build your personal brand and grow your audience strategically',
    longDescription:
      'Learn the strategies used by top creators to build powerful personal brands. Cover content strategy, audience building, monetization, and community engagement.',
    price: 39.99,
    originalPrice: 59.99,
    category: 'business',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
    ],
    rating: 4.6,
    reviews: 256,
    inStock: true,
    features: [
      'Content calendar templates',
      'Analytics deep-dive',
      'Audience growth hacks',
      'Monetization strategies',
      'Case studies',
    ],
    details: {
      format: 'Video Course + Worksheets',
      author: 'Emma Rodriguez',
      publishedDate: '2024',
    },
    tags: ['branding', 'marketing', 'growth', 'business'],
  },
  {
    id: '5',
    name: 'Advanced CSS Grid & Layouts',
    description: 'Master modern CSS layout techniques with Grid and Flexbox',
    longDescription:
      'Deep dive into modern CSS layout methods. Learn advanced grid techniques, responsive design patterns, and creative layout solutions used by top design teams.',
    price: 44.99,
    category: 'design',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    ],
    rating: 4.8,
    reviews: 198,
    inStock: true,
    features: [
      'Grid fundamentals',
      'Responsive layouts',
      'Animation techniques',
      'Browser compatibility',
      'Performance tips',
    ],
    details: {
      format: 'Interactive Course + Code Snippets',
      author: 'Lisa Chen',
      publishedDate: '2024',
    },
    tags: ['css', 'layout', 'design', 'frontend'],
  },
  {
    id: '6',
    name: 'Digital Marketing Masterclass',
    description: 'Complete guide to modern digital marketing strategies',
    longDescription:
      'Learn data-driven digital marketing strategies. From SEO and content marketing to paid advertising and analytics, master the channels that drive results.',
    price: 54.99,
    originalPrice: 84.99,
    category: 'marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1460925895917-adf4e565db18?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1460925895917-adf4e565db18?auto=format&fit=crop&w=600&q=80',
    ],
    rating: 4.7,
    reviews: 534,
    inStock: true,
    features: [
      'SEO mastery',
      'Content strategy',
      'Paid advertising',
      'Analytics & metrics',
      'Conversion optimization',
    ],
    details: {
      format: 'Video Course + Spreadsheet Templates',
      author: 'David Martinez',
      publishedDate: '2024',
    },
    tags: ['marketing', 'seo', 'advertising', 'growth'],
  },
  {
    id: '7',
    name: 'TypeScript Advanced Patterns',
    description: 'Expert-level TypeScript patterns and techniques',
    longDescription:
      'Master advanced TypeScript features including generics, decorators, advanced types, and architectural patterns used in production applications.',
    price: 49.99,
    category: 'development',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    ],
    rating: 4.9,
    reviews: 412,
    inStock: true,
    features: [
      'Generics mastery',
      'Type system deep-dive',
      'Design patterns',
      'Decorators',
      'Real-world examples',
    ],
    details: {
      format: 'Video Lectures + Code Repository',
      author: 'James Wilson',
      publishedDate: '2024',
    },
    tags: ['typescript', 'javascript', 'programming', 'development'],
  },
  {
    id: '8',
    name: 'UX Research & User Testing',
    description: 'Become an expert in user research and validation',
    longDescription:
      'Learn qualitative and quantitative research methods to deeply understand your users. Master user testing, interviews, surveys, and analytics.',
    price: 44.99,
    originalPrice: 69.99,
    category: 'design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80',
    ],
    rating: 4.6,
    reviews: 287,
    inStock: true,
    features: [
      'Research methodologies',
      'User interviews',
      'A/B testing',
      'Analytics tools',
      'Report templates',
    ],
    details: {
      format: 'Course + Templates + Tools Guide',
      author: 'Nicole Brown',
      publishedDate: '2024',
    },
    tags: ['ux', 'research', 'design', 'user-testing'],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.includes(q))
  );
}
