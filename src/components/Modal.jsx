import React from "react";
import Spiner from "./Spiner";

const Modal = ({ closeModal, details, isLoading }) => {

    const formatNumber = (num) => {
        if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
        if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
        return `$${num}`;
    };


    return (


        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-70 backdrop-blur-3xl">
            <div className="bg-[#0F0D23] text-white rounded-2xl shadow-[0px_12px_32px_0px_rgba(206,_206,_251,_0.2),_0px_0px_100px_0px_rgba(171,_139,_255,_0.3)] w-5/6 max-h-[90vh] overflow-y-auto p-6 relative">
                {isLoading ? <div className="flex justify-center items-center h-[90vh]">
                    <Spiner />
                </div> :
                    (<><button
                        className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl" onClick={() => closeModal()}
                    >
                        ✕
                    </button>

                        <h2 className="text-3xl font-bold mb-2">{details.title}</h2>
                        <div className="text-sm text-gray-400 mb-6 flex flex-row gap-1">
                            <div className="rating flex flex-row gap-0.5">
                                <img src="star.svg" alt="Star icon" />
                                <div>{details.vote_average ? details.vote_average.toFixed(1) : 'N/A'}</div>
                            </div>
                            <span>•</span>
                            <div className="lang">{details.original_language ? details.original_language : 'N/A'}</div>
                            <span>•</span>
                            <div className="year">
                                {details.release_date ? details.release_date.split('-')[0] : 'N/A'}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="w-[60vw]">
                                <img
                                    src={details.poster_path ? `https://image.tmdb.org/t/p/w500/${details.poster_path}` : '/no-movie.png'} alt={`${details.title} poster`}
                                    className="w-1/3 md:w-1/3 rounded-xl object-cover"
                                />
                            </div>
                            <div className="w-full md:w-2/3">
                                <img
                                    src="https://via.placeholder.com/600x300?text=Backdrop"
                                    alt="Backdrop"
                                    className="w-full rounded-xl object-cover mb-3"
                                />
                                <button className="bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg transition">
                                    ▶ Trailer · 0:31
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-[22ch_1fr] gap-y-4 text-sm text-[#D6C7FF] font-semibold">
                            <div className="font-medium text-[#A8B5DB]">Genres</div>
                            <div className="flex justify-between items-center flex-wrap gap-y-2 w-full">
                                <div className="flex gap-2 flex-wrap">
                                    {details.genres && details.genres.length > 0 && details.genres.map((genre) => (
                                        <span key={genre.id} className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full">{genre.name}</span>
                                    ))}
                                </div>

                                {details.homepage && <a
                                    href={details.homepage}
                                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg text-white font-medium"
                                >
                                    Visit Homepage →
                                </a>}


                            </div>



                            <div className="font-medium text-[#A8B5DB]">Overview</div>
                            <div className="text-white font-light max-w-3xl">
                                {details.overview ? details.overview : <span className="text-gray-500">'No overview available.'</span>}
                            </div>

                            <div className="font-medium text-[#A8B5DB]">Release date</div>
                            <div>
                                {details.release_date
                                    ? new Date(details.release_date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : <span className="text-gray-500">N/A</span>}
                            </div>


                            <div className="font-medium text-[#A8B5DB]">Countries</div>
                            <div className="flex flex-wrap gap-x-2">
                                {details.production_countries && details.production_countries.length > 0 ? (
                                    <span>
                                        {details.production_countries
                                            .map((country) => country.name)
                                            .join(' • ')}
                                    </span>
                                ) : (
                                    <span className="text-gray-500">No countries available</span>
                                )}

                            </div>

                            <div className="font-medium text-[#A8B5DB]">Status</div>
                            <div>{details.status}</div>

                            <div className="font-medium text-[#A8B5DB]">Language</div>
                            <div className="flex flex-wrap gap-x-2">
                                {details.spoken_languages && details.spoken_languages.length > 0 ? (
                                    <span>
                                        {details.spoken_languages
                                            .map((lang) => lang.name)
                                            .join(' • ')}
                                    </span>
                                ) : (
                                    <span className="text-gray-500">N/A</span>
                                )}
                            </div>

                            <div className="font-medium text-[#A8B5DB]">Budget</div>
                            <div>{details.budget ? formatNumber(details.budget) : <span className="text-gray-500">N/A</span>}</div>

                            <div className="font-medium text-[#A8B5DB]">Revenue</div>
                            <div>{details.revenue ? formatNumber(details.revenue) : <span className="text-gray-500">N/A</span>}</div>


                            <div className="font-medium text-[#A8B5DB]">Tagline</div>
                            <div>
                                {
                                    details.tagline ? (
                                        <span>"{details.tagline}"</span>
                                    ) : (
                                        <span className="text-gray-500">No tagline available</span>
                                    )
                                }
                            </div>

                            <div className="font-medium text-[#A8B5DB]">Production Companies</div>
                            <div className="flex flex-wrap gap-x-2">
                                {details.production_companies
                                    && details.production_companies
                                        .length > 0 ? (
                                    <span>
                                        {details.production_companies
                                            .map((prod) => prod.name)
                                            .join(' • ')}
                                    </span>
                                ) : (
                                    <span className="text-gray-500">No companies available</span>
                                )}
                            </div>
                        </div>
                    </>)}


            </div>
        </div>

    )


};



export default Modal;