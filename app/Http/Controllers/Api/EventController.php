<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventRequest;
use App\Http\Requests\EventUpdateRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    /**
     * 
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        Log::info('Fetching all events');
        $events = Event::all(); 
        return response()->json(['data' => $events]);
    }

    /**
     * 
     *
     * @param \App\Http\Requests\EventRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(EventRequest $request)
    {
        Log::info('Creating a new event');
        $data = $request->validated();

        
        if ($request->hasFile('image_path')) {
            $data['image_path'] = $request->file('image_path')->store('events', 'public');
        }

     
        $event = Event::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully!',
            'event' => new EventResource($event),
            'id' => $event->id, 
        ], 201);
    }

    /**
     * 
     *
     * @param \App\Models\Event $event
     * @return \App\Http\Resources\EventResource
     */
    public function show(Event $event)
    {
        Log::info('Fetching event details');
        return new EventResource($event);
    }

    /**
     * 
     *
     * @param \App\Http\Requests\EventUpdateRequest $request
     * @param \App\Models\Event                     $event
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(EventUpdateRequest $request, Event $event)
    {
        Log::info('Updating an event');
        $data = $request->validated();

       
        if ($request->hasFile('image_path')) {
         
            $data['image_path'] = $request->file('image_path')->store('events', 'public');
        }

     
        $event->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully!',
            'event' => new EventResource($event),
            'id' => $event->id,
        ], 200);
    }

    /**
     * 
     *
     * @param \App\Models\Event $event
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Event $event)
    {
      
        if ($event->image_path) {
            Storage::disk('public')->delete($event->image_path);
        }

       
        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully!',
        ], 204);
    }

    /**
     * 
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPublicEvents()
    {
        Log::info('Fetching public events');
        $events = Event::all(); 

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }
}
