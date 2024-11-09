import mongoose from 'mongoose';
import { mongodbUri } from '../config/mongo.config.js';
import { type } from 'os';

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB conectado correctamente");
    } catch (error) {
        console.error("Error conectando a MongoDB: ", error);
        process.exit(1);
    }
};

// Schema de Usuario
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\S+@\S+\.\S+$/.test(v); // Validación simple de email
            },
            message: props => `${props.value} no es un correo válido!`
        }
    },
    phone_number: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ['masculino', 'femenino', 'otro'],
        required: true
    },
    country: {
        type: String,
        enum: ['Spain', 'Mexico', 'otro'],
        required: true
    },
    street: {
        type: String,
        required: true

    },
    city: {
        type: String,
        required: true

    },
    postal_code: {
        type: String,
        required: true

    },
    birth_date: {
        type: Date,
        required: true,
    },
    roles: {
        type: [String],
        default: ["user"],
        enum: ["user", "admin"]
    },
    permissions: {
        manage_users: {
            type: Boolean,
            default: false
        },
        manage_products: {
            type: Boolean,
            default: false
        },
        view_reports: {
            type: Boolean,
            default: false
        },
        manage_orders: {
            type: Boolean,
            default: false
        }
    },
    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist'
    },
    orders: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Order'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    newsletter_subscription: {
        type: Boolean,
        default: false
    },
    contact_preferences:
    {
        email: {
            type: Boolean,
            default: false
        },
        phone: {
            type: Boolean,
            default: false
        },
        whatsapp: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: false
});

// Schema de Producto
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    base_price: {
        type: Number,
        required: true
    },
    collection: {
        type: String,
        required: true
    },
    out_of_stock: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0
    },
    brand: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['hombre', 'mujer'],
        required: true
    },
    product_code: {
        type: String,
        required: true,
        unique: true
    },
    variants: [
        {
            variant_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            product_code: {
                type: String,
                required: true
            },
            color: {
                colorName: {
                    type: String,
                    required: true
                },
                hexCode: {
                    type: String
                }
            },
            size: {
                type: [String],
                required: true
            },
            material: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            discount: {
                type: Number,
                default: 0
            },
            image: {
                type: [String],
                required: true
            },
            is_main: {
                type: Boolean,
                default: false
            }
        }
    ],
    new_arrival: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: false
});

// Schema de Wishlist
const wishlistSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Asegúrate de que ref sea correcto
        required: true
    },
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Asegúrate de que ref sea correcto
                required: true
            },
            variant_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            added_at: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true,
    versionKey: false
});




// Schema de Cart
const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            variant_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    total_price: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

// Schema de Orders
const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Delivered', 'Cancelled', 'Shipped'],
        default: 'Pending'
    },
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            variant_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    payment_methods: [
        {
            card_type: {
                type: String,
                required: true
            },
            card_number: {
                type: String,
                required: true
            },
            expiry_date: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true,
    versionKey: false
});

// Modelos
const User = mongoose.model('User', userSchema, 'accounts');
const Product = mongoose.model('Product', productSchema, 'products');
const Wishlist = mongoose.model('Wishlist', wishlistSchema, 'wishlists');
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema, 'cart');

// Exportar la conexión y los modelos
export { connectDB, User, Product, Wishlist, Order, Cart };
