import React, { useState, useEffect } from 'react';
import { storage, fs, auth } from '../Config';
import Navbar from './Navbar';
import './AddProducts.css';

function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                fs.collection('users')
                    .doc(user.uid)
                    .get()
                    .then((snapshot) => {
                        setUser(snapshot.data().FullName);
                    });
            } else {
                setUser(null);
            }
        });
    }, []);
    return user;
}

const AddProducts = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [brandName, setBrandName] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [genericName, setGenericName] = useState('');
    const [netQuantity, setNetQuantity] = useState('');
    const [image, setImage] = useState(null);
    const [imageError, setImageError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);

    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];

    const handleProductImg = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile && types.includes(selectedFile.type)) {
                setImage(selectedFile);
                setImageError('');
            } else {
                setImage(null);
                setImageError('Please select a valid image file type (png or jpg)');
            }
        } else {
            console.log('Please select your file');
        }
    };

    const handleAddProducts = (e) => {
        e.preventDefault();
        const uploadTask = storage.ref(`product-images/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log(progress);
            },
            (error) => {
                setUploadError(error.message);
            },
            () => {
                storage
                    .ref('product-images')
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        fs.collection('Products')
                            .add({
                                title,
                                description,
                                price: Number(price),
                                rating: Number(rating),
                                brandName,
                                sellerName,
                                genericName,
                                netQuantity:Number(netQuantity),
                                url,
                            })
                            .then(() => {
                                setSuccessMsg('Product added successfully');
                                setTitle('');
                                setDescription('');
                                setPrice('');
                                setRating('');
                                setBrandName('');
                                setSellerName('');
                                setGenericName('');
                                setNetQuantity('');
                                setImage(null);
                                document.getElementById('file').value = '';
                                setTimeout(() => {
                                    setSuccessMsg('');
                                }, 2000);
                            })
                            .catch((error) => setUploadError(error.message));
                    });
            }
        );
    };

    const user = GetCurrentUser();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                fs.collection('Cart ' + user.uid).onSnapshot((snapshot) => {
                    const qty = snapshot.docs.length;
                    setTotalProducts(qty);
                });
            }
        });
    }, []);

    return (
        <>
            <div>
                <Navbar user={user} totalProducts={totalProducts} />
            </div>
            <div className='container'>
                <h1>Add Products</h1>
                <hr />
                {successMsg && (
                    <>
                        <div className='success-msg'>{successMsg}</div>
                        <br />
                    </>
                )}
                <form autoComplete='off' className='form-group' onSubmit={handleAddProducts}>
                    <div className='form-row'>
                        <div className='form-column'>
                            <label>Product Title</label>
                            <input
                                type='text'
                                className='form-control'
                                required
                                placeholder='Enter product title'
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                            <br />
                            <label>Product Description</label>
                            <input
                                type='text'
                                className='form-control'
                                required
                                placeholder='Enter product description'
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            />
                            <br />
                            <label>Product Price</label>
                            <input
                                type='number'
                                className='form-control'
                                required
                                placeholder='Enter product price'
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                            />
                            <br />
                            <label>Product Rating</label>
                            <input
                                type='number'
                                className='form-control'
                                required
                                placeholder='Enter product rating'
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                            />
                            <br />
                        </div>
                        <div className='form-column'>
                            <label>Brand Name</label>
                            <input
                                type='text'
                                className='form-control'
                                required
                                placeholder='Enter brand name'
                                onChange={(e) => setBrandName(e.target.value)}
                                value={brandName}
                            />
                            <br />
                            <label>Seller Name</label>
                            <input
                                type='text'
                                className='form-control'
                                required
                                placeholder='Enter seller name'
                                onChange={(e) => setSellerName(e.target.value)}
                                value={sellerName}
                            />
                            <br />
                            <label>Generic Name</label>
                            <input
                                type='text'
                                className='form-control'
                                required
                                placeholder='Enter generic name'
                                onChange={(e) => setGenericName(e.target.value)}
                                value={genericName}
                            />
                            <br />
                            <label>Net Quantity</label>
                            <input
                                type='number'
                                className='form-control'
                                required
                                placeholder='Enter net quantity'
                                onChange={(e) => setNetQuantity(e.target.value)}
                                value={netQuantity}
                            />
                            <br />


                        </div>
                    </div>
                    <label>Upload Product Image</label>
                    <input
                        type='file'
                        id='file'
                        className='form-control'
                        required
                        onChange={handleProductImg}
                    />
                    {imageError && (
                        <>
                            <br />
                            <div className='error-msg'>{imageError}</div>
                        </>
                    )}
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button type='submit' className='btn btn-success btn-md'>
                            ADD PRODUCT
                        </button>
                    </div>
                </form>
                {uploadError && (
                    <>
                        <br />
                        <div className='error-msg'>{uploadError}</div>
                    </>
                )}
            </div>
        </>
    );
};

export default AddProducts;
