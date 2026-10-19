export interface Destination {
  id: number;
  nom: string;
  pays: string;
  ville: string;
  description: string;
  prix: number;
  image: string | null;
  offres?: Offre[];
}

export interface Offre {
  id: number;
  destination_id: number;
  titre: string;
  description: string;
  prix: number;
  duree: string;
  date_depart: string;
  destination?: Destination;
}

export interface ReservationPayload {
  offre_id: number | null;
  nom_client: string;
  email: string;
  telephone: string;
  nombre_personnes: number;
  date_reservation: string;
}

export interface ContactPayload {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

export interface ApiSuccess<T> {
  message: string;
  reservation?: T;
  contact?: T;
}
