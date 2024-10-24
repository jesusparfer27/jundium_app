import mongoose from 'mongoose';
import { mongodbUri } from '../config/mongo.config.js';

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(mongodbUri);
        console.log("MongoDB conectado correctamente");
    } catch (e) {
        console.log("Error conectando a MongoDB ", e.message);
        process.exit(1);
    }
};

// Schema de Usuario
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
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
        unique: true
    },
    phone_number: {
        type: String,
        required: false
    },
    address: {
        street: String,
        city: String,
        postal_code: String,
        country: String
    },
    roles: {
        type: [String],
        default: ["user"] // Por defecto, todos los usuarios son "user", pero puede incluir "admin"
    },
    wishlist: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    orders: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Order'
    },
    cart: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    newsletter_subscription: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true, // Añade createdAt y updatedAt
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
        required: true // Por ejemplo, "Camiseta", "Bolso", "Vestido"
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
                type: Number,
                required: true
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

// Modelos
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// Exportar la conexión y los modelos
export { connectDB, User, Product };
