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
        type: String
    },

    gender: {
        type: String,
        enum: ['masculino', 'femenino', 'otro'],
        required: true
    },
    address: {
        street: String,
        city: String,
        postal_code: String,
        country: String
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
    timestamps: true,
    versionKey: false,
    strict: false
});

// Función para crear un usuario administrador
const createAdminUser = async () => {
    const adminUser = new User({
        username: "admin_javier",
        first_name: "Javier",
        last_name: "Fernandez",
        email: "admin.javier@example.com",
        password: "$2b$10$YwA2uJcKx9JQkL7F8OtKTOlD8QWz7N/MN6J2x0Og5FJTwX6y9YxLi", // Debe estar cifrada
        phone_number: "+34 600 987 654",
        address: {
            street: "Avenida del Sol, 22",
            city: "Barcelona",
            postal_code: "08002",
            country: "España"
        },
        roles: ["admin", "user"],
        permissions: {
            manage_users: true,
            manage_products: true,
            view_reports: true,
            manage_orders: true
        },
        newsletter_subscription: false
    });

    try {
        await adminUser.save();
        console.log("Usuario administrador creado correctamente.");
    } catch (error) {
        console.error("Error creando usuario administrador:", error.message);
    }
};

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
    base_price: { // Aquí se ha añadido el campo base_price
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
const User = mongoose.model('User', userSchema, 'accounts');
const Product = mongoose.model('Product', productSchema);

// Exportar la conexión y los modelos
export { connectDB, User, Product, createAdminUser };
