const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(express.json());
app.use(cors());


let products = [
    {
        prodCode: "DS2S245",
        category: "Dining",
        desc: [
            "Two seater Dining Set",
            "Built from High quality wood",
            "1 year warranty"
        ],
        img: "https://hometown.gumlet.io/media/product/26/3773/35902/1.jpg",
        ingredients: [
            { ingName: "Dining Table", qty: 1 },
            { ingName: "Chair", qty: 2 }
        ],
        title: "Two seater Dining Set"
    },
    {
        prodCode: "DS6S761",
        category: "Dining",
        desc: [
            "Six Seater Dining Set in Antique Cherry Colour",
            "Assembly by Skilled Carpenters",
            "Made from Teak wood"
        ],
        img: "https://hometown.gumlet.io/media/product/55/3773/68909/1.jpg",
        ingredients: [
            { ingName: "Dining Table", qty: 1 },
            { ingName: "Chair", qty: 4 },
            { ingName: "Bench", qty: 1 }
        ],
        title: "Six Seater Dining Set"
    },
    {
        prodCode: "DS4S177",
        category: "Dining",
        desc: [
            "Mild Steel Four Seater Dining Set in Black Colour",
            "Knock-down construction for easy transportation"
        ],
        img: "https://hometown.gumlet.io/media/product/08/2453/47088/1.jpg",
        ingredients: [
            { ingName: "Dining Table", qty: 1 },
            { ingName: "Chair", qty: 4 }
        ],
        title: "Mild Steel Dining Set"
    },
    {
        prodCode: "DC2S705",
        category: "Dining",
        desc: [
            "Solid Wood Dining Chair Set of Two in Dark Walnut Colour",
            "Beautiful design carved on dining chair",
            "Dining chair seat upholstered in dark brown Fabric"
        ],
        img: "https://hometown.gumlet.io/media/product/94/3773/55262/1.jpg",
        ingredients: [{ ingName: "Chair", qty: 2 }],
        title: "Dining Chair Set"
    },
    {
        prodCode: "BN1S388",
        category: "Dining",
        desc: [
            "Solid Wood Dining Bench in Dark Walnut Colour",
            "Comfortable bench for a relaxed dinner"
        ],
        img: "https://hometown.gumlet.io/media/product/89/3063/70951/1.jpg",
        ingredients: [{ ingName: "Bench", qty: 1 }],
        title: "Dining Bench"
    },
    {
        prodCode: "SF2S532",
        category: "Drawing",
        desc: [
            "Characteristic Rising Track Arm Rest Design",
            "Premium High Gloss Leatherette Upholstery",
            "Independent Headrest And Lumber Support"
        ],
        img: "https://hometown.gumlet.io/media/product/34/6673/49218/1.jpg",
        ingredients: [{ ingName: "Sofa", qty: 1 }],
        title: "Two Seater Sofa"
    },
    {
        prodCode: "SF2S206",
        category: "Drawing",
        desc: ["Two Seater Sofa in Blue Colour", "Assembly by Skilled Carpenters"],
        img: "https://hometown.gumlet.io/media/product/00/1063/98569/1.jpg",
        ingredients: [{ ingName: "Sofa", qty: 1 }],
        title: "Two Seater Sofa"
    },
    {
        prodCode: "SFBD311",
        category: "Drawing",
        desc: [
            "Sofa Cum bed in Brown Colour",
            "Ply-wood construction with hand polished finish",
            "Removable fabric cover on best quality foam mattress",
            "Throw cushions and bolsters come with the product"
        ],
        img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fii1.pepperfry.com%2Fmedia%2Fcatalog%2Fproduct%2Fo%2Fh%2F1600x800%2Fohio-sofa-cum-bed-in-brown-colour-by--home-ohio-sofa-cum-bed-in-brown-colour-by--home-zsx7qw.jpg&f=1&nofb=1&ipt=932cb59c8329a1ea01a3035d371c1a534a50258e1f6e68c588ec36b387dc9279&ipo=images",
        ingredients: [{ ingName: "Sofa", qty: 1 }, { ingName: "Cushions", qty: 2 }],
        title: "Sofa cum Bed"
    },
    {
        prodCode: "BDQS381",
        category: "Bedroom",
        desc: [
            "Wood Box Storage King Size Bed in Wenge Colour ",
            "Box Storage included for Maximum space utilization",
            "Mattress is included"
        ],
        img: "https://hometown.gumlet.io/media/product/21/5763/45580/1.jpg",
        ingredients: [{ ingName: "Bed", qty: 1 }, { ingName: "Mattress", qty: 2 }],
        title: "King size Bed"
    },
    {
        prodCode: "BDQS229",
        category: "Bedroom",
        desc: [
            "Wood Hydraulic Storage Queen Size Bed",
            "Half hydraulic storage",
            "Superior E2 grade MDF used with melamine finish"
        ],
        img: "https://hometown.gumlet.io/media/product/26/8963/24098/1.jpg",
        ingredients: [{ ingName: "Bed", qty: 1 }],
        title: "Queen size Bed"
    },
    {
        prodCode: "ST1T425",
        category: "Study",
        desc: [
            "Wood Study Table in Walnut Colour",
            "Assembly by Skilled Carpenters",
            "Built from High Quality Wood"
        ],
        img: "https://hometown.gumlet.io/media/product/31/9353/34934/1.jpg",
        ingredients: [{ ingName: "Study Table", qty: 1 }],
        title: "Study Table"
    },
    {
        prodCode: "ST1T588",
        category: "Study",
        desc: [
            " Wood Study Table in Highgloss White & Blue Colour",
            "Study table comes with bookshelf on top, 5 drawers & 1 open shelf",
            "Superior quality MDF with stain resistant melamine finish"
        ],
        img: "https://hometown.gumlet.io/media/product/57/9863/56276/1.jpg",
        ingredients: [{ ingName: "Study Table", qty: 1 }],
        title: "Study Table"
    }
];
const users = [
    { id: 1, email: 'user@example.com', passwordHash: bcrypt.hashSync('password1', 10), role: "user" },
    { id: 2, email: 'admin@example.com', passwordHash: bcrypt.hashSync('password2', 10), role: "admin" },
];

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token missing' });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }

        req.user = decoded;

        // Check if the user has the necessary role (e.g., 'admin') to access the route
        if (decoded.userRole === 'admin') {
            next();
        } else {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }
    });
};

app.get('/products/:category', (req, res) => {
    const category = req.params.category;
    const filteredProducts = products.filter(product => product.category === category);
    res.json(filteredProducts);
});

app.get('/product/:prodcode', (req, res) => {
    const prodCode = req.params.prodcode;
    const foundProduct = products.find(product => product.prodCode === prodCode);
    res.json(foundProduct);
});

app.get('/products', (req, res) => {
    res.json(products);
});





app.post('/products', (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    res.json({ success: true, message: 'Product added successfully' });
});

app.put('/products/:prodCode', (req, res) => {
    const prodCodeToUpdate = req.params.prodCode;
    const updatedProduct = req.body;

    const index = products.findIndex(product => product.prodCode === prodCodeToUpdate);

    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = { ...products[index], ...updatedProduct };
    res.json({ success: true, message: 'Product updated successfully' });
});

app.delete('/products/:prodCode', (req, res) => {
    const prodCodeToDelete = req.params.prodCode;
    products = products.filter(product => product.prodCode !== prodCodeToDelete);
    res.json({ success: true, message: 'Product deleted successfully' });
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, userEmail: user.email, userRole: user.role }, 'your-secret-key', { expiresIn: '1h' });

    res.json({ success: true, token, userEmail: user.email, userRole: user.role });
});



const PORT = 2410;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});