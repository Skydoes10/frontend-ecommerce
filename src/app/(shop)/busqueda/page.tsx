'use client';
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const SearchPage = () => {
    const searchParams =  useSearchParams();
    const newParam = searchParams.get('search');

    useEffect(() => {
        console.log(newParam);
    }, []);

    return (
      <>
        {newParam}
        hello-world
      </>  
    );

};

export default SearchPage;
