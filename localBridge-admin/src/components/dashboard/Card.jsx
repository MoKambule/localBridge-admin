function Card({ title, value }) {
  return (
    <div className="group bg-white p-1 rounded-lg border border-gray-200 shadow-sm
                    hover:bg-[#116B72] hover:shadow-md
                    transition duration-200 cursor-pointer">

      <p className="text-gray-500 text-xs font-semibold group-hover:text-white">
        {title}
      </p>

      <h2 className="text-xl font-bold text-[#153E46] mt-1 group-hover:text-white">
        {value}
      </h2>

    </div>
  )
}

export default Card