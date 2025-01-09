<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Handle user signup.
     */
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        // Assign role based on email domain
        $role = (strpos($data['email'], '.crew@gmail.com') !== false) ? 'admin' : 'user';

        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'role' => $role, // Assign role
        ]);

        // Create token for the user
        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }

    /**
     * Handle user login.
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        // Attempt to authenticate the user
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email or password is incorrect'
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if the user's email contains `.crew@gmail.com` and assign admin role if necessary
        if (strpos($user->email, '.crew@gmail.com') !== false && $user->role !== 'admin') {
            $user->role = 'admin';
            $user->save();
        }

        // Create token for the authenticated user
        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Revoke the current access token
        $user->currentAccessToken()->delete();

        return response('', 204);
    }
}
