import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  UploadResult,
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { getStorage } from 'firebase/storage';
import _ from 'lodash';
import { Image, Product } from '../models/models';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private storage = getStorage();
  private db = getFirestore();

  constructor(public firestore: Firestore, private utils: UtilsService) {}

  async createProduct(product: Product): Promise<any> {
    this.utils.isLoading.set(true);

    const docRef = await addDoc(collection(this.firestore, 'products'), {
      name: product.name,
      description: product.description,
    });

    const productNoImages = _.cloneDeep(product);
    productNoImages.materials.forEach((material) =>
      material.colors.forEach((color) => {
        delete color.imgFile;
      })
    );
    const images: any = [];
    product.materials.forEach((material) =>
      material.colors.forEach((color) => {
        images.push({
          file: color.imgFile,
          fileName: `${material.name}_${color.name}`,
        });
      })
    );

    return Promise.all(
      images.map((img) => this.uploadImage(img.file, docRef.id, img.fileName))
    ).then((images) => {
      return Promise.all(
        images.map(async (img) =>
          getDownloadURL(img.ref).then((res) => {
            return { url: res, name: img?.metadata?.name };
          })
        )
      ).then(async (imgUrls) => {
        productNoImages.materials.forEach((material) =>
          material.colors.forEach((color) => {
            color.img = imgUrls.find(
              (img) => img.name === `${material.name}_${color.name}`
            )?.url;
          })
        );

        return await updateDoc(
          docRef,
          this.objectToDotNotation(productNoImages)
        );
      });
    });
  }

  async updateProduct(product: Product): Promise<any> {
    this.utils.isLoading.set(true);

    const id: string = product?.id!;
    const docRef = doc(this.db, 'products', id);

    const productNoImages = _.cloneDeep(product);

    productNoImages.materials.forEach((material) =>
      material.colors.forEach((color) => {
        delete color.imgFile;
      })
    );

    const images: any = [];
    product.materials.forEach((material) =>
      material.colors.forEach((color) => {
        if (color?.imgFile) {
          images.push({
            file: color.imgFile,
            fileName: `${material.name}_${color.name}`,
          });
        }
      })
    );

    if (!images.length) {
      const objToUpdate = this.objectToDotNotation(productNoImages);
      delete objToUpdate.id;
      return await updateDoc(docRef, objToUpdate);
    } else {
      return Promise.all(
        images.map((img) => this.uploadImage(img.file, id, img.fileName))
      ).then((images) => {
        return Promise.all(
          images.map(async (img) =>
            getDownloadURL(img.ref).then((res) => {
              return { url: res, name: img?.metadata?.name };
            })
          )
        ).then(async (imgUrls) => {
          productNoImages.materials.forEach((material) =>
            material.colors.forEach((color) => {
              color.img =
                imgUrls.find(
                  (img) => img.name === `${material.name}_${color.name}`
                )?.url || color?.img;
            })
          );

          const objToUpdate = this.objectToDotNotation(productNoImages);
          delete objToUpdate.id;

          return await updateDoc(docRef, objToUpdate);
        });
      });
    }
  }

  async getProducts(): Promise<Product[]> {
    this.utils.isLoading.set(true);
    return (await getDocs(query(collection(this.firestore, 'products')))).docs
      .map((product) => {
        return { ...product.data(), id: product.id } as Product;
      })
      .filter((product) => !product?.hidden)
      .sort((product1, product2) =>
        product1?.name
          ?.toLowerCase()
          .localeCompare(product2?.name?.toLocaleLowerCase())
      );
  }

  async addImageToGallery(image: Image): Promise<any> {
    const docRef = await addDoc(collection(this.firestore, 'gallery'), {
      position: image.position,
      name: image.file.name,
    });

    this.uploadImage(
      image.file,
      'gallery',
      `${docRef.id}_${image.file.name}`
    ).then((img) => {
      getDownloadURL(img.ref)
        .then((url) => url)
        .then(async (url) => {
          return await updateDoc(docRef, {
            url,
          });
        });
    });
  }

  async getGalleryImages(): Promise<Image[]> {
    return (
      await getDocs(query(collection(this.firestore, 'gallery')))
    ).docs.map((image) => {
      return { ...image.data(), id: image.id } as Image;
    });
  }

  async getProduct(id: string): Promise<Product> {
    return (await getDoc(doc(this.db, 'products', id))).data() as Product;
  }

  async deleteProduct(id: string): Promise<any> {
    this.deleteProductImages(id);
    return this.delete('products', id);
  }

  async delete(collection: string, id: string): Promise<any> {
    return await deleteDoc(doc(this.db, collection, id));
  }

  public uploadImage(
    image: any,
    id: string,
    fileName: string
  ): Promise<UploadResult> {
    const imageRef = ref(this.storage, `${id}/${fileName}`);
    return uploadBytes(imageRef, image);
  }

  public deleteImage(folder: string, name: string) {
    const imageRef = ref(this.storage, `${folder}/${name}`);
    return deleteObject(imageRef);
  }

  public deleteProductImages(key: string): void {
    listAll(ref(this.storage, `${key}`)).then(({ items }) => {
      items.map((imgRef) => deleteObject(imgRef));
    });
  }

  // public async getGalleryImages(): Promise<any> {
  //   const { items } = await listAll(ref(this.storage, `gallery`));

  //   return items.map((imgRef) => {
  //     return getDownloadURL(imgRef).then((imgUrl) => {
  //       return { url: imgUrl, ref: imgRef.name };
  //     });
  //   });
  // }

  public uploadGalleryImages(
    images: { file: any; name: string }[]
  ): Promise<any> {
    return Promise.all(
      images?.map((img) => {
        return this.uploadImage(img.file, 'gallery', img.name);
      })
    );
  }

  public uploadGalleryImagesTest(
    images: { file: any; name: string }[]
  ): Promise<any> {
    return Promise.all(
      images?.map((img) => {
        return this.uploadImage(img.file, 'gallery', img.name);
      })
    );
  }

  public async getHomepageInfo(): Promise<any> {
    return (await getDoc(doc(this.db, 'info', 'homepage'))).data();
  }

  public async updateTitleAndSubtitle(
    title: string,
    subtitle: string
  ): Promise<any> {
    const docRef = doc(this.db, 'info', 'homepage');
    return await setDoc(docRef, { title, subtitle });
  }

  private objectToDotNotation(
    obj: Partial<Product>,
    parent: any = [],
    keyValue: any = {}
  ) {
    for (let key in obj) {
      let keyPath = [...parent, key];
      if (obj[key] !== null && typeof obj[key] === 'object')
        Object.assign(
          keyValue,
          this.objectToDotNotation(obj[key], keyPath, keyValue)
        );
      else keyValue[keyPath.join('.')] = obj[key];
    }
    return keyValue;
  }
}
