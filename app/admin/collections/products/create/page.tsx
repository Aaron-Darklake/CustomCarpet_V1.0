'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import styles from './create.module.scss';
import { Gutter } from '../../../../../components/blocks/gutter/gutter';
import Icon from '../../../../../components/utils/icon.util';
import ProductSidebar from '../../../../../components/admin/sidebar/createSidebar';
import TitleInput from '../../../../../components/admin/titleInput/titleInput';
import Link from 'next/link';
import DropdownSelect from '../../../../../components/admin/dropDownSelect/dropDownSelect';
import DropDownSelectAdd from '../../../../../components/admin/dropDownSelectAdd/dropDownSelectAdd';
import TextInput from '../../../../../components/admin/textInput/TextInput';
import TextAreaInput from '../../../../../components/admin/textArea/textArea';
import MediaUploadButtons from '../../../../../components/admin/uploadButton/MediaUploadButton';
import dataClient from '@/components/config/data-server-client';
import { createStripeProductWithPrice } from '@/app/actions/stripe/createCustomer';
import { useModal } from '@faceless-ui/modal';
import { DrawerModalCategory } from '@/components/admin/drawer/tableDrawer/drawer';
import { DrawerModalNewMedia } from '@/components/admin/drawer/newMedia/drawer';
import UploadOverlay from '@/components/admin/uploadOverlay';
import { useNotification } from '@/providers/Notification';
import dataClientPrivate from '@/components/config/data-server-client-private';





const CreateProduct = () => {
  const router = useRouter();
  const { toggleModal } = useModal();
  const { showMessage } = useNotification();
  // State for dropdown visibility and selected category
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);
  const [isDropdownOpenRelatedProduct, setIsDropdownOpenRelatedProduct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedRelatedProduct, setSelectedRelatedProduct] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([])

  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState(''); // New state for title
  const [metaTitle, setMetaTitle] = useState(''); // New state for title
  const [metaDescription, setMetaDescription] = useState(''); // New state for description
  // State for status flags
  const [isMetaTitleGood, setIsMetaTitleGood] = useState(false);
  const [isMetaDescriptionGood, setIsMetaDescriptionGood] = useState(false);
  const [checksPassed, setChecksPassed] = useState(0);
  const [categories, setCategories]=useState([])
  const [inputPrice, setInputPrice]=useState(null)
  const [media, setMedia]=useState([])
   const [mediaRaw, setMediaRaw]=useState([])
   const [uploadProgress, setUploadProgress] = useState(0);


  useEffect(() => {
    let passedChecks = 0;
    if (isMetaTitleGood) passedChecks++;
    if (isMetaDescriptionGood) passedChecks++;
    // Add more checks here if needed
    setChecksPassed(passedChecks);
  }, [isMetaTitleGood, isMetaDescriptionGood]);

  
  const products = ['Related Product 1', 'Related Product 2', 'Related Product 3'];

  // Inside your component

const handleSubmit = async (event) => {
  event.preventDefault();
  const price = parseFloat(inputPrice) * 100;
  // Collect product details like title, description, and price
  const productDetails = {
    title: title,
    description: metaDescription,
    unitAmount: price, // example price in cents
  };

  try {
    setUploadProgress(25)
    // Call the function to create product and price in Stripe
    const stripeResponse = await createStripeProductWithPrice(productDetails);

   
    if (stripeResponse?.success === false) {
      throw new Error('Failed to create Stripe customer');
    } else(
      console.log('Stripe customer created successfully')
    )

    const { stripeProductId, stripePriceId, priceJson } = stripeResponse;
    setUploadProgress(50);
    console.log('Stripe product ID:', stripeProductId);
    console.log('Stripe price ID:', stripePriceId);
    console.log('Price JSON:', priceJson);
    let productItem
      if(selectedRelatedProduct.length > 0 && selectedRelatedProduct[0] !== ''){
    productItem = {
      title: title,
      description: metaDescription,
      slug: slug,
      images: mediaRaw,
      categories: selectedCategory,
      relatedProducts: selectedRelatedProduct,
      priceJSON: priceJson,
      stripeProductId: stripeProductId,
      stripePriceID: stripePriceId,
    }} else {
      productItem = {
        title: title,
        description: metaDescription,
        slug: slug,
        images: mediaRaw,
        categories: selectedCategory,
        priceJSON: priceJson,
        stripeProductId: stripeProductId,
        stripePriceID: stripePriceId,
    }
  }
  console.log('Product Item:', productItem);
  const mediaIds = mediaRaw.map(media => media.id);
  const categoryIds = selectedCategory.map(category => category.id);
  
  if(selectedRelatedProduct.length > 0 && selectedRelatedProduct[0] !== ''){
     const relatedProductIds = selectedRelatedProduct.map(product => product.id);
  const {data: newProduct, errors} = await dataClientPrivate.models.Product.create({
                                                 title: JSON.parse(JSON.stringify(title)),
                                                 description: JSON.parse(JSON.stringify(metaDescription)),
                                                 slug: JSON.parse(JSON.stringify(slug)),
                                                 images: JSON.parse(JSON.stringify(mediaIds)),
                                                 categories: JSON.parse(JSON.stringify(categoryIds)),
                                                 relatedProducts: JSON.parse(JSON.stringify(relatedProductIds)),
                                                 priceJSON: JSON.parse(JSON.stringify(priceJson)),
                                                 stripeProductID: JSON.parse(JSON.stringify(stripeProductId)),
                                                 stripePriceID: JSON.parse(JSON.stringify(stripePriceId)),
                                                })
                                                if(errors){
                                                  throw new Error('Failed to create product');
                                                } else {
                                                console.log('New Product:', newProduct);
                                                setUploadProgress(85);
                                                const interval = setInterval(() => {
                                                  setUploadProgress(prevProgress => {
                                                    if (prevProgress >= 100) {
                                                      showMessage('Product created and connected to Stripe successfully!');
                                                      router.push('/admin/collections/products');
                                                      clearInterval(interval);
                                                      return 100;
                                                    }
                                                    return prevProgress + 1;
                                                  });
                                                }, 100);}
                                              } else {
                                                
                                                const {data: newProduct, errors} = await dataClientPrivate.models.Product.create({
                                                  title: JSON.parse(JSON.stringify(title)),
                                                  description: JSON.parse(JSON.stringify(metaDescription)),
                                                  slug: JSON.parse(JSON.stringify(slug)),
                                                  images: JSON.parse(JSON.stringify(mediaIds)),
                                                  categories: JSON.parse(JSON.stringify(categoryIds)),
                                                  priceJSON: JSON.parse(JSON.stringify(priceJson)),
                                                  stripeProductID: JSON.parse(JSON.stringify(stripeProductId)),
                                                  stripePriceID: JSON.parse(JSON.stringify(stripePriceId)),
                                                 })
                                                 if(errors){
                                                   throw new Error('Failed to create product');
                                                 } else {
                                                 console.log('New Product:', newProduct);
                                                 setUploadProgress(85);
                                                 const interval = setInterval(() => {
                                                   setUploadProgress(prevProgress => {
                                                     if (prevProgress >= 100) {
                                                       showMessage('Product created and connected to Stripe successfully!');
                                                       router.push('/admin/collections/products');
                                                       clearInterval(interval);
                                                       return 100;
                                                     }
                                                     return prevProgress + 1;
                                                   });
                                                 }, 100);}
                                              }
  

  } catch (error) {
    console.error('Error:', error);
  }
};


  const handleSlugChange = (event) => {
    setSlug(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleMetaTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMetaTitle(event.target.value);
  };

  const handleMetaDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetaDescription(event.target.value);
  };

  ///
  // Function to calculate progress percentage
  const calculateProgress = (text, minChars, maxChars) => {
    const progress = (text.length / maxChars) * 100;
    return progress > 100 ? 100 : progress; // Cap progress at 100%
  };

  // Function to determine progress status
  const getProgressStatus = (text, minChars, maxChars) => {
    const length = text.length;
    if (length === 0) {
      return 'Missing';
    } else if (length < minChars - 10) {
      return 'Too short';
    } else if (length >= minChars - 10 && length < minChars) {
      return 'Almost there';
    } else if (length >= minChars && length <= maxChars) {
      return 'Good';
    } else if(length > maxChars){
      return 'Too long';
    }
  };

  // Function to get progress bar color
  const getProgressBarColor = (status) => {
    switch (status) {
      case 'Too short':
        return 'orangered';
      case 'Almost there':
        return 'orange';
      case 'Good':
        return 'green';
      default:
        return 'var(--error-color)';
    }
  };

  // Calculate progress and status for meta title
  const metaTitleProgress = calculateProgress(metaTitle, 50, 60);
  const metaTitleStatus = getProgressStatus(metaTitle, 50, 60);
  const metaTitleColor = getProgressBarColor(metaTitleStatus);
  useEffect(() => {
    setIsMetaTitleGood(metaTitleStatus === 'Good');
  }, [metaTitleStatus]);

  // Calculate progress and status for meta description
  const metaDescriptionProgress = calculateProgress(metaDescription, 100, 150);
  const metaDescriptionStatus = getProgressStatus(metaDescription, 100, 150);
  const metaDescriptionColor = getProgressBarColor(metaDescriptionStatus);
  useEffect(() => {
    setIsMetaDescriptionGood(metaDescriptionStatus === 'Good');
  }, [metaDescriptionStatus]);



  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  // Handle dropdown toggle
  const toggleDropdownProduct = () => {
    setIsDropdownOpenProduct(!isDropdownOpenProduct);
  };
  // Handle dropdown toggle
  const toggleDropdownRelatedProduct = () => {
    setIsDropdownOpenRelatedProduct(!isDropdownOpenRelatedProduct);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    // Assuming 'category' is an object with category details
    setSelectedCategory(prevCategories => {
      // Check if the category is already in the array
      if (prevCategories.some(cat => cat.id === category.id)) {
        // If already selected, return the existing array without adding it again
        return prevCategories;
      } else {
        // If not selected, add the new category to the array
        return [...prevCategories, category];
      }
    });
    setIsDropdownOpen(false);
  };

  const resetSelectedCategory = () => {
    setSelectedCategory([]);
    setIsDropdownOpen(false);
  };

  const handlePriceChange = (event) => {
    // Convert input from Euros to cents and update state
    setInputPrice(event.target.value); // Round to nearest cent
    console.log('price',inputPrice)
  };

  const handleMediaRawSelect = (selectedMediaArray) => {
    const updatedMediaRaw = [...mediaRaw];
  
    [].concat(selectedMediaArray).forEach(selectedMedia => {
      if (!mediaRaw.some(media => media.id === selectedMedia.id)) {
        updatedMediaRaw.push(selectedMedia);
      }
    });
  
    setMediaRaw(updatedMediaRaw);
  };
  
  const handleMediaSelect = (selectedMediaArray) => {
    const updatedMedia = [...media];
  
    [].concat(selectedMediaArray).forEach(selectedMedia => {
      if (!media.some(media => media.id === selectedMedia.id)) {
        updatedMedia.push(selectedMedia);
      }
    });
  
    setMedia(updatedMedia);
  };
  

  
  const handleRemoveMedia = (mediaToRemove) => {
    // Remove the specific media from the media and mediaRaw arrays
    console.log('Removing media:', mediaToRemove);
    setMedia(media.filter(m => m.id !== mediaToRemove));
    setMediaRaw(mediaRaw.filter(m => m.id !== mediaToRemove));
  };
 

  
  // Handle product selection
  const handleRelatedProductSelect = (product) => {
    setSelectedRelatedProduct(prevProducts => {
      // Check if the category is already in the array
      if (prevProducts.some(prod => prod.id === product.id)) {
        // If already selected, return the existing array without adding it again
        return prevProducts;
      } else {
        // If not selected, add the new category to the array
        return [...prevProducts, product];
      }
    });
    setIsDropdownOpenRelatedProduct(false);
  };

  const resetSelectedRelatedProduct = (productToRemove) => {
    setSelectedRelatedProduct(selectedRelatedProduct.filter(m => m.id !== productToRemove));
    setIsDropdownOpenRelatedProduct(false);
  };

  const fetchCategories =  async () => {
    const{data: fetchedCategories} = await dataClient.models.Category.list();
    setCategories(fetchedCategories)
}
  const fetchProducts =  async () => {
    const{data: fetchedProducts} = await dataClient.models.Product.list();
    setRelatedProducts(fetchedProducts)
}


  console.log('selected category',selectedCategory)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { username, userId, signInDetails} = await getCurrentUser();
        if(!userId ){
          router.push('/login')
        }else {
        const userAttributes = await fetchUserAttributes()
        const role = userAttributes?.['custom:role']
        if(role !== 'admin'){
          router.push('/login')
        }
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log('The signInDetails:', signInDetails);
      }
        
      } catch (err) {
        
        console.log(err);
      }
    };
    fetchProducts();
    fetchCategories();
    checkUser();
  }, []);

  return (
    <main className={styles.collection_edit}>
      <DrawerModalCategory onMediaSelect={handleMediaSelect} onMediaRawSelect={handleMediaRawSelect} multipleSelect={true} initialSelectedMedia={media} initialSelectedMediaRaw={mediaRaw}/>
        <DrawerModalNewMedia onMediaSelect={handleMediaSelect} onMediaRawSelect={handleMediaRawSelect}/>
        {uploadProgress > 0 && uploadProgress < 100  && (
        <UploadOverlay uploadProgress={uploadProgress}/>
      )}
      <form className={styles.collection_edit_form}>
        <Gutter className={styles.collection_edit_form_header}>
          <h1 className={styles.collection_edit_form_header_h1}>
            {`${title || '[Untitled]'}`}
          </h1>
        </Gutter>
        <div className={styles.collection_edit_form_controls}>
          <div className={styles.collection_edit_form_controls_wrapper}>
            <div className={styles.collection_edit_form_controls_content}>
              <ul className={styles.collection_edit_form_controls_meta}>
                <li className={styles.collection_edit_form_controls_meta_list}>
                  <p className={styles.collection_edit_form_controls_content_value}>Creating new Product</p>
                </li>
              </ul>
            </div>
            <div className={styles.collection_edit_form_controls_controls_wrapper}>
              <div className={styles.collection_edit_form_controls_controls}>
                <div className={styles.collection_edit_form_submit}>
                    <button type='button' className={styles.collection_edit_form_submit_btn} onClick={handleSubmit}>
                      <span className={styles.collection_edit_form_submit_btn_content}>
                        <span className={styles.collection_edit_form_submit_btn_label}>Save Product</span>
                      </span>
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.document_fields_with_sidebar}>
          <div className={styles.document_fields_main}>
          <div className={styles.document_fields_main_gutter}>
            <TitleInput
             label="Title"
             value={title}
             onChange={handleTitleChange}
             required={true} />
             <div className={styles.document_fields_main_tab_fields}>
              <div className={styles.document_fields_main_tab_fields_wrapper}>
                <div className={styles.document_fields_main_tab_fields_tabs}>
                  <button className={styles.document_fields_main_tab_fields_tab_button}>
                    Product Details
                  </button>
                </div>
              </div>
              <div className={styles.document_fields_main_tab_content_wrapper}>
                <div className={styles.document_fields_main_tab_content_fields}>
                  <div className={styles.document_fields_main_tab_content_render_fields}>
                    <div>
                        <TitleInput
                          label="Price"
                          value={inputPrice}
                          onChange={handlePriceChange}
                          required={true}
                          noBorder={true}
                        />
                    </div>
                    <input id='price-json' type='hidden'/>  
                  </div>
                  <DropDownSelectAdd
                 selectedValue={selectedRelatedProduct}
                 items={relatedProducts}
                 handleSelect={handleRelatedProductSelect}
                 resetSelection={resetSelectedRelatedProduct}
                 isDropdownOpen={isDropdownOpenRelatedProduct}
                 toggleDropdown={toggleDropdownRelatedProduct}
                 label="Related Products"
                 placeholder="Select a Product"
                 addNewButton={true} // 
                  />
                </div>
              </div>
             </div>
             <div className={styles.document_fields_main_seo}>
              <div className={styles.document_fields_main_seo_field_wrap}>
                <div className={styles.document_fields_main_seo_field_header}>
                  <header>
                    <h3 className={styles.document_fields_main_seo_field_title}>SEO</h3>
                  </header>
                </div>
                <div className={styles.document_fields_main_seo_field_render_fields}>
                  <div style={{marginBottom: '20px', fontSize: '13px'}}>
                    <div>{`${checksPassed}/3 checks are passing`}</div>
                  </div>
                  <div style={{marginBottom: '20px'}}>
                    <div style={{marginBottom: '5px', position: 'relative', fontSize: '13px', lineHeight:'25px'}}>
                      <div>Title{` - `} <button type='button' style={{padding:'0px', background:'none', cursor: 'pointer', textDecoration:'underline', color:'var(--primary)'}} onClick={()=>setMetaTitle(title)}>auto generate</button></div>
                      <div style={{color: 'var(--primary-dim)'}}>
                        {`This should be between 50 and 60 characters. For help in writing meta titles, see `}
                          <a
                            href="https://developers.google.com/search/docs/advanced/appearance/title-link?utm_source=devtools#page-titles"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{fontWeight:'400', color:'var(--primary-dim)', textDecoration:'underline', cursor:'pointer'}}
                          >
                            best practices
                          </a>
                        .
                      </div>
                    </div>
                    <div style={{marginBottom: '10px', position: 'relative'}}>
                   <TextInput
                    value={metaTitle}
                    onChange={handleMetaTitleChange}
                    />
                    </div>
                    <div style={{display: 'flex', alignItems:'center',width:'100%'}}>
                      <div style={{width:'100%', display:'flex', alignItems:'center'}}>
                        <div style={{fontSize: '11px', padding: '4px 6px', borderRadius: '2px', marginRight: '10px', whiteSpace: 'nowrap', flexShrink: '0', lineHeight: '1', background: metaTitleColor, color: 'white', marginTop:'-10px'}}>
                          <small>{metaTitleStatus}</small>
                        </div>
                        <div style={{marginRight: '10px', whiteSpace: 'nowrap', flexShrink: '0', lineHeight: '1', fontSize: '11px', marginTop:'-10px'}}>
                          <small>{`${metaTitle.length}/50-60 chars, ${60 - metaTitle.length} to go`}</small>
                        </div>
                        <div style={{height: '2px', width: '100%', background: 'var(--primary)', position: 'relative',marginTop:'-10px'}}>
                          <div style={{height: '100%', width: `${metaTitleProgress}%`, position: 'absolute', left: '0px', top: '0px', background: metaTitleColor,}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{marginBottom: '20px'}}>
                    <div style={{marginBottom: '5px', position: 'relative', fontSize: '13px', lineHeight:'25px'}}>
                      <div>{`Description`}</div>
                      <div style={{color: 'var(--primary-dim)'}}>
                        {`This should be between 100-150 characters. For help in writing meta descriptions, see `}
                          <a
                            href="https://developers.google.com/search/docs/advanced/appearance/snippet?utm_source=devtools#meta-descriptions"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{fontWeight:'400', color:'var(--primary-dim)', textDecoration:'underline', cursor:'pointer'}}
                          >
                            best practices
                          </a>
                        .
                      </div>
                    </div>
                    <div style={{marginBottom: '10px', position: 'relative'}}>
                    <TextAreaInput
                    value={metaDescription}
                    onChange={handleMetaDescriptionChange}/>
                    </div>
                    <div style={{display: 'flex', alignItems:'center',width:'100%'}}>
                      <div style={{width:'100%', display:'flex', alignItems:'center'}}>
                        <div style={{fontSize: '11px', padding: '4px 6px', borderRadius: '2px', marginRight: '10px', whiteSpace: 'nowrap', flexShrink: '0', lineHeight: '1', background: metaDescriptionColor, color: 'white', marginTop:'5px'}}>
                          <small>{metaDescriptionStatus}</small>
                        </div>
                        <div style={{marginRight: '10px', whiteSpace: 'nowrap', flexShrink: '0', lineHeight: '1', fontSize: '11px', marginTop:'5px'}}>
                          <small>{`${metaDescription.length}/100-150 chars, ${150 - metaDescription.length} to go`}</small>
                        </div>
                        <div style={{height: '2px', width: '100%', background: 'var(--primary)', position: 'relative',marginTop:'5px'}}>
                          <div style={{height: '100%', width: `${metaDescriptionProgress}%`, position: 'absolute', left: '0px', top: '0px',  background: metaDescriptionColor,}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{marginBottom: '20px'}}>
                  
                    <MediaUploadButtons
                    label='Image'
                    selectedMedia={media}
                    multipleSelect={true}
                    onRemoveMedia={handleRemoveMedia}
                    onUploadNewMedia={() => toggleModal('modal-drawer-new-media')}
                    onChooseExistingMedia={() => toggleModal('modal-drawer-categories')}/>

                    <div style={{display: 'flex', alignItems:'center',width:'100%'}}>
                      <div style={{width:'100%', display:'flex', alignItems:'center'}}>
                        <div style={{fontSize: '11px', padding: '4px 6px', borderRadius: '2px', marginRight: '10px', whiteSpace: 'nowrap', flexShrink: '0', lineHeight: '1', background: 'var(--error-color)', color: 'white', marginTop:'5px'}}>
                          <small>No Image</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             </div>
          </div>
          </div>
          <ProductSidebar 
          selectedCategory={selectedCategory}
          categories={categories}
          handleCategorySelect={handleCategorySelect}
          resetSelectedCategory={resetSelectedCategory}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          slug={slug}
          handleSlugChange={handleSlugChange}/>
        </div>
        
      </form>
    </main>
    
  );
};



export default CreateProduct;