
/*
GENERATED ON: 1560603016484
*/ 


// The Maybe Monad implemented in TypeScript
type Maybe<T> = Nothing<T> | Just<T>

class Just<T> {
  a: T;
  constructor(a) {
    if (a !== null && a !== undefined) this.a = a;
    // @ts-ignore
    else return new Nothing();
  }
}

class Nothing<T> {}

// IMPLEMENTATION


interface IPerson {
    Address: IAddress;
}
  


interface IAddress {

}
  
    