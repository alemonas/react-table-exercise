import { useState, useEffect } from 'react'

// https://randomuser.me/api/?results=20

const fetchApi = async () => {
  const results = await fetch('https://randomuser.me/api/?results=20').then(
    response => response.json(),
  )

  return results.results
}

const mapDataToLocations = (data: any) => {
  console.log('data map:', data)
  const locations = data.map((item: any) => {
    const { city, coordinates, country, state, street } = item.location
    const { latitude, longitude } = coordinates
    const { name: streetName } = street
    return {
      city,
      country,
      state,
      latitude,
      longitude,
      streetName,
    }
  })

  return locations
}

const locationsHeaders = [
  {
    name: 'city',
    sortedBy: 'default',
  },
  {
    name: 'country',
    sortedBy: 'default',
  },
  {
    name: 'state',
    sortedBy: 'default',
  },
  {
    name: 'latitude',
    sortedBy: 'default',
  },
  {
    name: 'longitude',
    sortedBy: 'default',
  },
  {
    name: 'streetName',
    sortedBy: 'default',
  },
]

function Locations() {
  const [locations, setLocations] = useState([])
  // console.log('render', locations)
  const [headers, setHeaders] = useState(locationsHeaders)

  useEffect(() => {
    const results = fetch('https://randomuser.me/api/?results=20')
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        const loc = mapDataToLocations(data.results)
        // console.log({ loc })
        setLocations(loc)
      })

    // const locations = mapDataToLocations(data)
  }, [])

  if (locations.length === 0) {
    return <div>No Locations</div>
  }

  const handleClick = (event: any, header: any) => {
    console.log(event)
    console.log(header)
    const headerName = header.name
    const sortedBy = header.sortedBy

    const sortedLocations = [...locations]
    let direction = 'default'
    // console.log({sortedLocations})
    if (sortedBy === 'default' || sortedBy === 'down') {
      sortedLocations.sort((a: any, b: any) => {
        // console.log(a.city)
        if (a[headerName] < b[headerName]) return -1
        if (b[headerName] < a[headerName]) return 1

        return 0
      })
      direction = 'up'
    }

    if (sortedBy === 'up') {
      sortedLocations.sort((a: any, b: any) => {
        // console.log(a.city)
        if (a[headerName] < b[headerName]) return 1
        if (b[headerName] < a[headerName]) return -1

        return 0
      })

      direction = 'down'
    }

    const updatedHeaders = headers.map(header => {
      if (header.name === headerName) {
        return {
          name: headerName,
          sortedBy: direction,
        }
      }
      return header
    })

    console.log({ updatedHeaders })
    setHeaders(updatedHeaders)
    // const updatedLocations = Object.assign({}, sortedLocation)

    // console.log({ updatedLocations })
    setLocations(sortedLocations)
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            {headers.map((header: any) => {
              return (
                <td key={header.name}>
                  <button
                    onClick={e => {
                      handleClick(e, header)
                    }}
                  >
                    {header.name}
                  </button>
                </td>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {locations.map((location: any, index: number) => (
            <tr key={`${location.city}-${index}`}>
              <td>{location.city}</td>
              <td>{location.country}</td>
              <td>{location.state}</td>
              <td>{location.latitude}</td>
              <td>{location.longitude}</td>
              <td>{location.streetName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Locations
